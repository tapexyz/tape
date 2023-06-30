import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@lenstube/browser'
import { REQUESTING_SIGNATURE_MESSAGE } from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import type { CreateUnfollowBroadcastItemResult, Profile } from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateUnfollowTypedDataMutation
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onUnSubscribe: () => void
}

const UnSubscribe: FC<Props> = ({ channel, onUnSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const { openConnectModal } = useConnectModal()

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }
  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
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

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => onCompleted(broadcast.__typename),
    onError
  })

  const { write } = useContractWrite({
    address: channel.followNftAddress,
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
        if (data?.broadcast?.__typename === 'RelayError') {
          const { tokenId } = typedData.value
          return write?.({ args: [tokenId] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const unsubscribe = () => {
    if (!selectedChannelId) {
      return openConnectModal?.()
    }
    setLoading(true)
    createUnsubscribeTypedData({
      variables: {
        request: { profile: channel?.id }
      }
    })
  }

  return (
    <Button onClick={() => unsubscribe()} loading={loading}>
      <Trans>Unsubscribe</Trans>
    </Button>
  )
}

export default UnSubscribe
