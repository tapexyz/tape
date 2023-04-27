import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { Trans } from '@lingui/macro'
import { utils } from 'ethers'
import type {
  CreateFollowBroadcastItemResult,
  Profile,
  ProxyActionRequest
} from 'lens'
import {
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProxyActionMutation
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED_MESSAGE,
  TRACK
} from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onSubscribe()
    setLoading(false)
    toast.success(`Subscribed to ${channel.handle}`)
    Analytics.track(TRACK.CHANNEL.SUBSCRIBE, {
      channel_id: channel.id,
      channel_name: channel.handle
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: signer } = useSigner({ onError })

  const { write: writeSubscribe } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  })

  const [broadcast] = useBroadcastMutation({
    onCompleted: (data) => {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted()
      }
    },
    onError
  })

  const [createSubscribeProxyAction] = useProxyActionMutation({
    onError,
    onCompleted
  })

  const [createSubscribeTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { typedData, id } =
        createFollowTypedData as CreateFollowBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const { profileIds, datas } = typedData?.value
        const args = {
          follower: signer?.getAddress(),
          profileIds,
          datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          writeSubscribe?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const createTypedData = async () => {
    if (channel?.followModule?.__typename === 'ProfileFollowModuleSettings') {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    }
    await createSubscribeTypedData({
      variables: {
        request: {
          follow: [
            {
              profile: channel.id,
              followModule:
                channel?.followModule?.__typename ===
                'ProfileFollowModuleSettings'
                  ? {
                      profileFollowModule: { profileId: selectedChannel?.id }
                    }
                  : null
            }
          ]
        }
      }
    })
  }

  const viaProxyAction = async (variables: ProxyActionRequest) => {
    const { data } = await createSubscribeProxyAction({
      variables: { request: variables }
    })
    if (!data?.proxyAction) {
      await createTypedData()
    }
  }

  const subscribe = () => {
    if (!selectedChannelId) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    }
    setLoading(true)
    if (channel.followModule) {
      return createTypedData()
    }
    viaProxyAction({
      follow: {
        freeFollow: {
          profileId: channel?.id
        }
      }
    })
  }

  return (
    <Button onClick={() => subscribe()} loading={loading}>
      <Trans>Subscribe</Trans>
    </Button>
  )
}

export default Subscribe
