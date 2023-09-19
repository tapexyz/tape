import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import FollowingOutline from '@components/Common/Icons/FollowingOutline'
import type { ButtonSizes, ButtonVariants } from '@components/UIElements/Button'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@lenstube/browser'
import { REQUESTING_SIGNATURE_MESSAGE } from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import type { CreateUnfollowBroadcastItemResult, Profile } from '@lenstube/lens'
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation
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
  onUnSubscribe: () => void
  variant?: ButtonVariants
  size?: ButtonSizes
  showText?: boolean
}

const UnSubscribe: FC<Props> = ({
  channel,
  onUnSubscribe,
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
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }
  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }

    setLoading(false)
    onUnSubscribe()
    toast.success(`Unsubscribed ${channel.handle}`)
    Analytics.track(TRACK.CHANNEL.UNSUBSCRIBE, {
      channel_id: channel.id,
      channel_name: channel.handle
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const { write } = useContractWrite({
    address: channel.followNftAddress?.address,
    abi: FOLLOW_NFT_ABI,
    functionName: 'burn',
    onSuccess: () => onCompleted(),
    onError
  })

  const [createUnsubscribeTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } =
        createUnfollowTypedData as CreateUnfollowBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          const { idsOfProfilesToUnfollow } = typedData.value
          return write?.({ args: [idsOfProfilesToUnfollow[0]] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const unsubscribe = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    setLoading(true)
    return createUnsubscribeTypedData({
      variables: {
        request: { unfollow: [channel?.id] }
      }
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => unsubscribe()}
      loading={loading}
      icon={
        <FollowingOutline
          className={clsx({
            'h-2.5 w-2.5': size === 'sm',
            'h-3.5 w-3.5': size === 'md',
            'h-4 w-4': size === 'lg',
            'h-5 w-5': size === 'xl'
          })}
        />
      }
    >
      {showText && <Trans>Subscribed</Trans>}
    </Button>
  )
}

export default UnSubscribe
