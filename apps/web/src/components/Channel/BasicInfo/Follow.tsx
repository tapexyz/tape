import { LENSHUB_PROXY_ABI } from '@lenstube/abis'
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
  useCreateFollowTypedDataMutation,
  useFollowMutation
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  profile: Profile
  onSubscribe: () => void
  size?: '1' | '2' | '3'
}

const Follow: FC<Props> = ({ profile, onSubscribe, size = '2' }) => {
  const [loading, setLoading] = useState(false)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const activeChannel = useChannelStore((state) => state.activeChannel)
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

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
    toast.success(`Followed ${profile.handle}`)
    Analytics.track(TRACK.CHANNEL.SUBSCRIBE, {
      channel_id: profile.id,
      channel_name: profile.handle
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

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { typedData, id } = createFollowTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          const {
            followerProfileId,
            idsOfProfilesToFollow,
            followTokenIds,
            datas
          } = typedData.value
          write?.({
            args: [
              followerProfileId,
              idsOfProfilesToFollow,
              followTokenIds,
              datas
            ]
          })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const [followMutation] = useFollowMutation({
    onCompleted: () => onCompleted(),
    onError
  })

  const follow = async () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    setLoading(true)
    if (canUseRelay) {
      return await followMutation({
        variables: {
          request: {
            follow: [
              {
                profileId: profile.id
              }
            ]
          }
        }
      })
    }
    return await createFollowTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profileId: profile.id
            }
          ]
        }
      }
    })
  }

  return (
    <Button
      size={size}
      disabled={loading}
      variant="classic"
      onClick={() => follow()}
      highContrast
    >
      <Trans>Follow</Trans>
    </Button>
  )
}

export default Follow
