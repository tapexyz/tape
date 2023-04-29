import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import Tooltip from '@components/UIElements/Tooltip'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { utils } from 'ethers'
import type {
  CreateMirrorBroadcastItemResult,
  CreateMirrorRequest,
  Publication
} from 'lens'
import {
  useBroadcastMutation,
  useCreateDataAvailabilityMirrorViaDispatcherMutation,
  useCreateMirrorTypedDataMutation,
  useCreateMirrorViaDispatcherMutation
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, LenstubeCollectModule } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  video: Publication
  onMirrorSuccess?: () => void
  children: React.ReactNode
}

const MirrorVideo: FC<Props> = ({ video, children, onMirrorSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { openConnectModal } = useConnectModal()

  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const collectModule =
    video?.__typename === 'Post'
      ? (video?.collectModule as LenstubeCollectModule)
      : null

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    onMirrorSuccess?.()
    toast.success('Mirrored video across lens.')
    setLoading(false)
    Analytics.track(TRACK.PUBLICATION.MIRROR, {
      publication_id: video.id,
      publication_state: video.isDataAvailability ? 'DATA_ONLY' : 'ON_CHAIN'
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [createDataAvailabilityMirrorViaDispatcher] =
    useCreateDataAvailabilityMirrorViaDispatcherMutation({
      onCompleted: () => onCompleted(),
      onError
    })

  const [createMirrorViaDispatcher] = useCreateMirrorViaDispatcherMutation({
    onError,
    onCompleted: ({ createMirrorViaDispatcher }) =>
      onCompleted(createMirrorViaDispatcher.__typename)
  })

  const { write: mirrorWithSig } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename)
  })

  const [createMirrorTypedData] = useCreateMirrorTypedDataMutation({
    onCompleted: async ({ createMirrorTypedData }) => {
      const { id, typedData } =
        createMirrorTypedData as CreateMirrorBroadcastItemResult
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData
      } = typedData?.value
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const sig = { v, r, s, deadline: typedData.value.deadline }
        const args = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig
        }
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          mirrorWithSig?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const createTypedData = (request: CreateMirrorRequest) => {
    createMirrorTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request
      }
    })
  }

  const createViaDispatcher = async (request: CreateMirrorRequest) => {
    const { data } = await createMirrorViaDispatcher({
      variables: { request }
    })
    if (data?.createMirrorViaDispatcher.__typename === 'RelayError') {
      createTypedData(request)
    }
  }

  const mirrorVideo = async () => {
    if (!selectedChannelId) {
      return openConnectModal?.()
    }
    setLoading(true)

    if (video.isDataAvailability) {
      const dataAvailablityRequest = {
        from: selectedChannelId,
        mirror: video.id
      }
      return await createDataAvailabilityMirrorViaDispatcher({
        variables: { request: dataAvailablityRequest }
      })
    }

    const request = {
      profileId: selectedChannelId,
      publicationId: video?.id,
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }
    const canUseDispatcher =
      selectedChannel?.dispatcher?.canUseRelay &&
      selectedChannel.dispatcher.sponsor
    if (!canUseDispatcher) {
      return createTypedData(request)
    }
    await createViaDispatcher(request)
  }

  if (!video?.canMirror.result) {
    return null
  }

  const tooltipContent = collectModule?.referralFee
    ? `Mirror video for ${collectModule?.referralFee}% referral fee`
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
