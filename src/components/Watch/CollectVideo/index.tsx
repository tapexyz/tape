import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { Mixpanel, TRACK } from '@utils/track'
import { utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineCollection } from 'react-icons/hi'
import {
  BroadcastDocument,
  CreateCollectBroadcastItemResult,
  CreateCollectTypedDataDocument,
  ProxyActionDocument,
  PublicationCollectModuleDocument
} from 'src/types/lens'
import {
  CustomErrorWithData,
  LenstubeCollectModule,
  LenstubePublication
} from 'src/types/local'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import CollectModal from './CollectModal'

type Props = {
  video: LenstubePublication
  variant?: 'primary' | 'secondary'
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

  const { data, loading: fetchingCollectModule } = useQuery(
    PublicationCollectModuleDocument,
    {
      variables: { request: { publicationId: video?.id } }
    }
  )
  const collectModule = // @ts-ignore
    data?.publication?.collectModule as LenstubeCollectModule

  const { write: writeCollectWithSig } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useMutation(BroadcastDocument, {
    onError,
    onCompleted
  })

  const [createProxyActionFreeCollect] = useMutation(ProxyActionDocument, {
    onError,
    onCompleted
  })

  const [createCollectTypedData] = useMutation(CreateCollectTypedDataDocument, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createCollectTypedData as CreateCollectBroadcastItemResult
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
        // @ts-ignore
        if (data?.broadcast?.reason)
          writeCollectWithSig?.({ recklesslySetUnpreparedArgs: [args] })
      } catch (error) {
        setLoading(false)
        logger.error('[Error Collect Video]', error)
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
      Mixpanel.track(TRACK.COLLECT.FEE)
      return createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: video?.id }
        }
      })
    }
    Mixpanel.track(TRACK.COLLECT.FREE)
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
      {showCollectModal && (
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
              <HiOutlineCollection className="text-xl" />
            )}
          </Button>
        </div>
      </Tooltip>
    </div>
  )
}

export default CollectVideo
