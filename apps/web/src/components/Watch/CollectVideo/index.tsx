import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { utils } from 'ethers'
import type { CreateCollectBroadcastItemResult, Publication } from 'lens'
import {
  useBroadcastMutation,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationCollectModuleQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, LenstubeCollectModule } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE,
  TRACK
} from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import CollectModal from './CollectModal'

type Props = {
  video: Publication
  variant?: 'primary' | 'secondary' | 'material'
}

const CollectVideo: FC<Props> = ({ video, variant = 'primary' }) => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [alreadyCollected, setAlreadyCollected] = useState(
    video.hasCollectedByMe
  )
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    setLoading(false)
    setAlreadyCollected(true)
    toast.success('Collected as NFT')
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
        if (!RELAYER_ENABLED) {
          return writeCollectWithSig?.({ recklesslySetUnpreparedArgs: [args] })
        }
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

  const collectNow = () => {
    setShowCollectModal(false)
    setLoading(true)
    if (!isFreeCollect) {
      Analytics.track(TRACK.COLLECT.FEE)
      return createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: video?.id }
        }
      })
    }
    Analytics.track(TRACK.COLLECT.FREE)
    // Using proxyAction to free collect without signing
    createProxyActionFreeCollect({
      variables: {
        request: {
          collect: { freeCollect: { publicationId: video?.id } }
        }
      }
    })
  }

  const onClickCollect = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    return setShowCollectModal(true)
  }

  const collectTooltipText = isFreeCollect ? (
    'Collect as NFT'
  ) : (
    <span>
      Collect as NFT for
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
            ? 'Collecting'
            : alreadyCollected
            ? 'Already Collected'
            : collectTooltipText
        }
        placement="top"
      >
        <div>
          <Button
            className="!px-2"
            disabled={loading || alreadyCollected}
            onClick={() => onClickCollect()}
            size="md"
            variant={variant}
          >
            {loading ? (
              <Loader size="md" />
            ) : (
              <CollectOutline className="w-5 h-5" />
            )}
          </Button>
        </div>
      </Tooltip>
    </div>
  )
}

export default CollectVideo
