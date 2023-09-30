import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import FollowOutline from '@components/Common/Icons/FollowOutline'
import type { ButtonSizes, ButtonVariants } from '@components/UIElements/Button'
import { Button } from '@components/UIElements/Button'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
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
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
  variant?: ButtonVariants
  size?: ButtonSizes
  showText?: boolean
}

const Subscribe: FC<Props> = ({
  channel,
  onSubscribe,
  variant = 'primary',
  size = 'md',
  showText = true
}) => {
  const [loading, setLoading] = useState(false)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const { openConnectModal } = useConnectModal()
  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
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
    onSuccess: () => onCompleted(),
    onError
  })

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename),
    onError
  })

  const [createSubscribeProxyAction] = useProxyActionMutation({
    onError,
    onCompleted: () => onCompleted()
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
                      profileFollowModule: {
                        profileId: selectedSimpleProfile?.id
                      }
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
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (handleWrongNetwork()) {
      return
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
    <Button
      variant={variant}
      size={size}
      onClick={() => subscribe()}
      loading={loading}
      icon={
        <FollowOutline
          className={clsx({
            'h-2.5 w-2.5': size === 'sm',
            'h-3.5 w-3.5': size === 'md',
            'h-4 w-4': size === 'lg',
            'h-5 w-5': size === 'xl'
          })}
        />
      }
    >
      {showText && <Trans>Subscribe</Trans>}
    </Button>
  )
}

export default Subscribe
