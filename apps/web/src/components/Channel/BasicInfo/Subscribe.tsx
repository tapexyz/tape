import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import FollowOutline from '@components/Common/Icons/FollowOutline'
import type { ButtonSizes, ButtonVariants } from '@components/UIElements/Button'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation
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

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
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

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const [createSubscribeTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { typedData, id } = createFollowTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          const { idsOfProfilesToFollow, datas } = typedData.value
          write?.({ args: [idsOfProfilesToFollow, datas] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const subscribe = async () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    setLoading(true)
    return await createSubscribeTypedData({
      variables: {
        request: {
          follow: [
            {
              profileId: channel.id
            }
          ]
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
