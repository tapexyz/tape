import Tooltip from '@components/UIElements/Tooltip'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useAuthPersistStore from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { t } from '@lingui/macro'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import { getSignature } from '@tape.xyz/generic'
import type {
  CreateMomokaMirrorEip712TypedData,
  CreateOnchainMirrorEip712TypedData,
  MirrorablePublication
} from '@tape.xyz/lens'
import {
  TriStateValue,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaMirrorTypedDataMutation,
  useCreateOnchainMirrorTypedDataMutation,
  useMirrorOnchainMutation,
  useMirrorOnMomokaMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: MirrorablePublication
  onMirrorSuccess?: () => void
  children: React.ReactNode
}

const MirrorVideo: FC<Props> = ({ video, children, onMirrorSuccess }) => {
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const canUseRelay = activeProfile?.lensManager && activeProfile?.sponsor

  const getReferralFee = () => {
    const action = video.openActionModules?.[0]
    if (
      action?.__typename === 'SimpleCollectOpenActionSettings' ||
      action?.__typename === 'MultirecipientFeeCollectOpenActionSettings' ||
      action?.__typename === 'LegacyFeeCollectModuleSettings' ||
      action?.__typename === 'LegacyLimitedFeeCollectModuleSettings' ||
      action?.__typename === 'LegacyLimitedTimedFeeCollectModuleSettings' ||
      action?.__typename === 'LegacyTimedFeeCollectModuleSettings' ||
      action?.__typename === 'LegacyMultirecipientFeeCollectModuleSettings' ||
      action?.__typename === 'LegacySimpleCollectModuleSettings' ||
      action?.__typename === 'LegacyERC4626FeeCollectModuleSettings' ||
      action?.__typename === 'LegacyAaveFeeCollectModuleSettings'
    ) {
      return action.referralFee
    }
  }

  const referralFee = getReferralFee()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    onMirrorSuccess?.()
    toast.success('Mirrored video across lens.')
    setLoading(false)
    Analytics.track(TRACK.PUBLICATION.MIRROR, {
      publication_id: video.id,
      publication_state: video.momoka?.proof ? 'DATA_ONLY' : 'ON_CHAIN'
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'mirror',
    onError,
    onSuccess: () => onCompleted()
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaMirrorEip712TypedData | CreateOnchainMirrorEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const [mirrorOnChain] = useMirrorOnchainMutation({
    onCompleted: () => onCompleted()
  })

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        onCompleted()
      }
    }
  })

  const [createOnChainMirrorTypedData] =
    useCreateOnchainMirrorTypedDataMutation({
      onCompleted: async ({ createOnchainMirrorTypedData }) => {
        const { typedData, id } = createOnchainMirrorTypedData
        try {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return write?.({ args: [typedData.value] })
          }
        } catch {}
      },
      onError
    })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
      }
    }
  })

  const [createMomokaCommentTypedData] = useCreateMomokaMirrorTypedDataMutation(
    {
      onCompleted: async ({ createMomokaMirrorTypedData }) => {
        const { typedData, id } = createMomokaMirrorTypedData
        try {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return write?.({ args: [typedData.value] })
          }
        } catch {}
      },
      onError
    }
  )

  const [mirrorOnMomoka] = useMirrorOnMomokaMutation({
    onCompleted: () => onCompleted()
  })

  const mirrorVideo = async () => {
    if (!selectedSimpleProfile?.id) {
      return toast.error('Sign in to proceed')
    }
    if (handleWrongNetwork()) {
      return
    }

    if (video.momoka?.proof && !activeProfile?.sponsor) {
      return toast.error(
        t`Momoka is currently in beta - during this time certain actions are not available to all profiles.`
      )
    }

    try {
      setLoading(true)

      // MOMOKA
      if (canUseRelay) {
        if (video.momoka?.proof) {
          return await mirrorOnMomoka({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        } else {
          return await createMomokaCommentTypedData({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        }
      } else {
        //   // ON-CHAIN
        if (canUseRelay) {
          return await mirrorOnChain({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        } else {
          return await createOnChainMirrorTypedData({
            variables: {
              request: {
                mirrorOn: video.id
              }
            }
          })
        }
      }
    } catch {}
  }

  if (video?.operations.canMirror !== TriStateValue.Yes) {
    return null
  }

  const tooltipContent = referralFee
    ? `Mirror video for ${referralFee}% referral fee`
    : t`Mirror video across Lens`

  return (
    <Tooltip placement="top" content={loading ? t`Mirroring` : tooltipContent}>
      <div className="inline-flex">
        <button
          type="button"
          className="disabled:opacity-50"
          disabled={loading}
          onClick={() => mirrorVideo()}
        >
          {children}
        </button>
      </div>
    </Tooltip>
  )
}

export default MirrorVideo
