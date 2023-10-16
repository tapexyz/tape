import useAuthPersistStore from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import { getProfile, getSignature } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useFollowMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
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
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const userSigNonce = useProfileStore((state) => state.userSigNonce)
  const setUserSigNonce = useProfileStore((state) => state.setUserSigNonce)
  const canUseRelay = activeProfile?.lensManager && activeProfile?.sponsor

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
    toast.success(`Followed ${getProfile(profile)?.displayName}`)
    Analytics.track(TRACK.CHANNEL.SUBSCRIBE, {
      channel_id: profile.id,
      channel_name: getProfile(profile)?.slug
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
      return toast.error('Sign in to proceed')
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
      onClick={() => follow()}
      highContrast
    >
      <Trans>Follow</Trans>
    </Button>
  )
}

export default Follow
