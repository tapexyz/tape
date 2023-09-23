import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import {
  type MirrorablePublication,
  useBroadcastOnchainMutation,
  useCreateOnchainMirrorTypedDataMutation
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
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
  const { openConnectModal } = useConnectModal()

  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const activeChannel = useChannelStore((state) => state.activeChannel)

  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

  const collectModule =
    video?.__typename === 'Post' ? video?.openActionModules : null

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

  const [broadcast] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createMirrorTypedData] = useCreateOnchainMirrorTypedDataMutation({
    onCompleted: async ({ createOnchainMirrorTypedData }) => {
      const { id, typedData } = createOnchainMirrorTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          write?.({ args: [typedData.value] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  // const createTypedData = async (request: CreateMirrorRequest) => {
  //   await createMirrorTypedData({
  //     variables: {
  //       options: { overrideSigNonce: userSigNonce },
  //       request
  //     }
  //   })
  // }

  // const createViaDispatcher = async (request: CreateMirrorRequest) => {
  //   const { data } = await createMirrorViaDispatcher({
  //     variables: { request }
  //   })
  //   if (data?.createMirrorViaDispatcher.__typename === 'RelayError') {
  //     await createTypedData(request)
  //   }
  // }

  // const mirrorVideo = async () => {
  //   if (!selectedSimpleProfile?.id) {
  //     return openConnectModal?.()
  //   }

  //   if (video.momoka?.proof && !isSponsored) {
  //     return toast.error(
  //       t`Momoka is currently in beta - during this time certain actions are not available to all channels.`
  //     )
  //   }

  //   setLoading(true)
  //   const request: CreateMirrorRequest = {
  //     profileId: activeChannel?.id,
  //     publicationId: video?.id,
  //     referenceModule: {
  //       followerOnlyReferenceModule: false
  //     }
  //   }

  //   // Payload for the data availability mirror
  //   const dataAvailablityRequest = {
  //     from: activeChannel?.id,
  //     mirror: video?.id
  //   }

  //   if (canUseRelay) {
  //     if (video.isDataAvailability && isSponsored) {
  //       return await createDataAvailabilityMirrorViaDispatcher({
  //         variables: { request: dataAvailablityRequest }
  //       })
  //     }

  //     return await createViaDispatcher(request)
  //   }

  //   return await createTypedData(request)
  // }

  if (!video?.operations.canMirror) {
    return null
  }

  // const referralFee =
  //   collectModule?.referralFee ?? collectModule?.fee?.referralFee
  // const tooltipContent = referralFee
  //   ? `Mirror video for ${referralFee}% referral fee`
  //   : t`Mirror video across Lens`

  return (
    <Tooltip
      placement="top"
      content={loading ? t`Mirroring` : 'tooltipContent'}
    >
      <div className="inline-flex">
        <button
          type="button"
          className="disabled:opacity-50"
          disabled={loading}
          // onClick={() => mirrorVideo()}
        >
          {children}
        </button>
      </div>
    </Tooltip>
  )
}

export default MirrorVideo
