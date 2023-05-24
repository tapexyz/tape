import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { Trans, t } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import { utils } from 'ethers'
import type { CreateCollectBroadcastItemResult, Publication } from 'lens'
import {
  useBroadcastMutation,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationCollectModuleQuery
} from 'lens'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Analytics,
  CustomErrorWithData,
  DragverseCollectModule,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import CollectModal from './CollectModal'

type Props = {
  video: Publication
  variant?: 'hover'
}

const CollectVideo: React.FC<Props> = ({ video, variant }) => {
  const { address } = useAccount()
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
      ? (data?.publication?.collectModule as DragverseCollectModule)
      : null

  const { write: writeCollectWithSig } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
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
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          collector: address,
          profileId: typedData?.value.profileId,
          pubId: typedData?.value.pubId,
          data: typedData.value.data,
          sig: { v, r, s, deadline: typedData.value.deadline }
        }
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          writeCollectWithSig?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const isFreeCollect =
    video.collectModule.__typename === 'FreeCollectModuleSettings'

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
    if (isFreeCollect && !collectModule?.followerOnly) {
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

  const collectTooltipText = isFreeCollect ? (
    t`Collect as NFT`
  ) : (
    <span>
      <Trans>Collect as NFT for</Trans>
      <b className="ml-1 space-x-1">
        <span>{collectModule?.amount?.value}</span>
        <span>{collectModule?.amount?.asset.symbol}</span>
      </b>
    </span>
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
