import type { CreateUnfollowBroadcastItemResult, Profile } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  Tower
} from '@tape.xyz/generic'
import {
  useBroadcastOnchainMutation,
  useCreateUnfollowTypedDataMutation,
  useUnfollowMutation
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  onUnSubscribe: () => void
  profile: Profile
  showText?: boolean

  size?: '1' | '2' | '3'
}

const UnFollow: FC<Props> = ({ onUnSubscribe, profile, size = '2' }) => {
  const [loading, setLoading] = useState(false)

  const { activeProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)

  const handleWrongNetwork = useHandleWrongNetwork()

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
    toast.success(`Unfollowed ${getProfile(profile)?.displayName}`)
    Tower.track(EVENTS.PROFILE.UNFOLLOW, {
      profile_id: profile.id,
      profile_name: getProfile(profile)?.slug
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
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'burn',
    onError,
    onSuccess: () => onCompleted()
  })

  const [createUnfollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { id, typedData } =
        createUnfollowTypedData as CreateUnfollowBroadcastItemResult
      const { idsOfProfilesToUnfollow, unfollowerProfileId } = typedData.value
      const args = [unfollowerProfileId, idsOfProfilesToUnfollow]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return write({ args })
          }
          return
        }
        return write({ args })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const [unFollowMutation] = useUnfollowMutation({
    onCompleted: () => onCompleted(),
    onError
  })

  const unfollow = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }

    setLoading(true)
    if (canUseLensManager) {
      return await unFollowMutation({
        variables: {
          request: {
            unfollow: [profile.id]
          }
        }
      })
    }
    return createUnfollowTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: { unfollow: [profile?.id] }
      }
    })
  }

  return (
    <Button
      disabled={loading}
      highContrast
      onClick={() => unfollow()}
      size={size}
    >
      {loading && <Loader size="sm" />}
      Unfollow
    </Button>
  )
}

export default UnFollow
