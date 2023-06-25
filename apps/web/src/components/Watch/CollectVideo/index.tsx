import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from '@lenstube/constants'
import type {
  CreateCollectBroadcastItemResult,
  Publication
} from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationCollectModuleQuery
} from '@lenstube/lens'
import type {
  CustomErrorWithData,
  LenstubeCollectModule
} from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import getSignature from 'utils/functions/getSignature'
import { useContractWrite, useSignTypedData } from 'wagmi'

import CollectModal from './CollectModal'

type Props = {
  video: Publication
  variant?: 'hover'
}

const CollectVideo: FC<Props> = ({ video, variant }) => {
  const { openConnectModal } = useConnectModal()

  const [loading, setLoading] = useState(false)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [alreadyCollected, setAlreadyCollected] = useState(
    video.hasCollectedByMe
  )
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    setLoading(false)
    setAlreadyCollected(true)
    toast.success(t`Collected as NFT`)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { data, loading: fetchingCollectModule } =
    usePublicationCollectModuleQuery({
      variables: { request: { publicationId: video?.id } }
    })
  const collectModule =
    data?.publication?.__typename === 'Post'
      ? (data?.publication?.collectModule as LenstubeCollectModule)
      : null
  const collectAmount =
    collectModule?.amount?.value ?? collectModule?.fee?.amount?.value
  const currency =
    collectModule?.amount?.asset?.symbol ??
    collectModule?.fee?.amount?.asset?.symbol

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'collect',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createProxyActionFreeCollect] = useProxyActionMutation({
    onError,
    onCompleted
  })

  const [createCollectTypedData] = useCreateCollectTypedDataMutation({
    onCompleted: async ({ createCollectTypedData }) => {
      const { typedData, id } =
        createCollectTypedData as CreateCollectBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          const { profileId, pubId, data: collectData } = typedData.value
          return write?.({ args: [profileId, pubId, collectData] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const createTypedData = async () => {
    await createCollectTypedData({
      variables: {
        request: { publicationId: video?.id },
        options: { overrideSigNonce: userSigNonce }
      }
    })
  }

  const viaProxyAction = async () => {
    const { data } = await createProxyActionFreeCollect({
      variables: {
        request: {
          collect: { freeCollect: { publicationId: video?.id } }
        }
      }
    })
    if (!data?.proxyAction) {
      await createTypedData()
    }
  }

  const collectNow = async () => {
    setShowCollectModal(false)
    setLoading(true)
    if (!Boolean(collectAmount) && !collectModule?.followerOnly) {
      Analytics.track(TRACK.PUBLICATION.COLLECT, { fee: false })
      await viaProxyAction()
    } else {
      Analytics.track(TRACK.PUBLICATION.COLLECT, { fee: true })
      await createTypedData()
    }
  }

  const onClickCollect = () => {
    if (!selectedChannelId) {
      return openConnectModal?.()
    }
    return setShowCollectModal(true)
  }

  const collectTooltipText = collectAmount ? (
    <span>
      <Trans>Collect as NFT for</Trans>
      <b className="ml-1 space-x-1">
        <span>{collectAmount}</span>
        <span>{currency}</span>
      </b>
    </span>
  ) : (
    t`Collect as NFT`
  )

  return (
    <div>
      {showCollectModal && collectModule && (
        <CollectModal
          video={video}
          showModal={showCollectModal}
          setShowModal={setShowCollectModal}
          collectNow={collectNow}
          collecting={loading}
          collectModule={collectModule}
          fetchingCollectModule={fetchingCollectModule}
        />
      )}
      <Tooltip
        content={
          loading
            ? t`Collecting`
            : alreadyCollected
            ? t`Already Collected`
            : collectTooltipText
        }
        placement="top"
      >
        <div>
          <button
            className={clsx('p-2.5', variant === 'hover' && 'btn-hover')}
            disabled={loading || alreadyCollected}
            onClick={() => onClickCollect()}
          >
            {loading ? (
              <Loader size="md" />
            ) : (
              <CollectOutline className="h-5 w-5" />
            )}
          </button>
        </div>
      </Tooltip>
    </div>
  )
}

export default CollectVideo
