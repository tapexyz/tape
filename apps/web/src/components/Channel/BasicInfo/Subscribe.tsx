import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import type {
  CreateFollowBroadcastItemResult,
  Profile,
  ProxyActionRequest
} from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProxyActionMutation
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

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
  const { openConnectModal } = useConnectModal()

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

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'follow',
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
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          const { profileIds, datas } = typedData.value
          write?.({ args: [profileIds, datas] })
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
      return openConnectModal?.()
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
