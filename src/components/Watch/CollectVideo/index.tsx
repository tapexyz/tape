import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import {
  BROADCAST_MUTATION,
  VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY
} from '@gql/queries'
import { PROXY_ACTION_MUTATION } from '@gql/queries/proxy-action'
import { CREATE_COLLECT_TYPED_DATA } from '@gql/queries/typed-data'
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
  CreateCollectBroadcastItemResult,
  FreeCollectModuleSettings
} from 'src/types'
import { LenstubeCollectModule, LenstubePublication } from 'src/types/local'
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

  const onError = (error: any) => {
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
    VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY,
    {
      variables: { request: { publicationId: video?.id } }
    }
  )
  const collectModule: LenstubeCollectModule = data?.publication?.collectModule

  const { write: writeCollectWithSig } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onCompleted
  })

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted
  })

  const [createProxyActionFreeCollect] = useMutation(PROXY_ACTION_MUTATION, {
    onError,
    onCompleted
  })

  const [createCollectTypedData] = useMutation(CREATE_COLLECT_TYPED_DATA, {
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
          return writeCollectWithSig?.({ recklesslySetUnpreparedArgs: args })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.reason)
          writeCollectWithSig?.({ recklesslySetUnpreparedArgs: args })
      } catch (error) {
        setLoading(false)
        logger.error('[Error Collect Video]', error)
      }
    },
    onError
  })

  const isFreeCollect =
    video.collectModule.__typename === 'FreeCollectModuleSettings'
  const handleCollect = (validate = true) => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    const collectModule = video.collectModule as FreeCollectModuleSettings
    if ((!isFreeCollect || collectModule.followerOnly) && validate) {
      return setShowCollectModal(true)
    }
    if (!validate) {
      toast('Collecting as NFT...')
      setShowCollectModal(false)
    }
    setLoading(true)
    if (isFreeCollect) {
      Mixpanel.track(TRACK.COLLECT.FREE)
      // Using proxyAction to free collect without signing
      createProxyActionFreeCollect({
        variables: {
          request: {
            collect: { freeCollect: { publicationId: video?.id } }
          }
        }
      })
    } else {
      Mixpanel.track(TRACK.COLLECT.FEE)
      createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: video?.id }
        }
      })
    }
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
          handleCollect={handleCollect}
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
            onClick={() => handleCollect()}
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
