import type {
  CreateSetFollowModuleBroadcastItemResult,
  Profile
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'

import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getSignature,
  Tower
} from '@tape.xyz/generic'
import {
  FollowModuleType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  profile: Profile
}

const RevertFollow = ({ profile }: Props) => {
  const [loading, setLoading] = useState(false)
  const [isRevertFollow, setIsRevertFollow] = useState(
    profile.followModule?.type === FollowModuleType.RevertFollowModule
  )
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  )
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  )
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    setIsRevertFollow(!isRevertFollow)
    toast.success('Follow settings updated')
    Tower.track(EVENTS.PROFILE.SETTINGS.TOGGLE_REVERT_FOLLOW)
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { data: writtenData, write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'setFollowModule',
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writtenData?.hash,
    txId:
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      onCompleted()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { id, typedData } =
          createSetFollowModuleTypedData as CreateSetFollowModuleBroadcastItemResult
        const { followModule, followModuleInitData, profileId } =
          typedData.value
        const args = [profileId, followModule, followModuleInitData]
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
            return onCompleted(data?.broadcastOnchain?.__typename)
          }
          return write({ args })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const toggleRevert = async (revertFollowModule: boolean) => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    return await createSetFollowModuleTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          followModule: { revertFollowModule }
        }
      }
    })
  }

  return (
    <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">
          {isRevertFollow ? 'Enable' : 'Disable'} Follow
        </h1>
        <p className="text opacity-80">
          {isRevertFollow
            ? 'Enable follow back to allow others to follow you.'
            : "You're in complete control of your online presence and profile. You can choose to be off the radar and no one can follow."}
        </p>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {isRevertFollow ? (
          <Button
            disabled={loading}
            highContrast
            onClick={() => toggleRevert(false)}
            variant="surface"
          >
            {loading && <Loader size="sm" />}
            Enable Follow
          </Button>
        ) : (
          <Button
            color="red"
            disabled={loading}
            highContrast
            onClick={() => toggleRevert(true)}
            variant="surface"
          >
            {loading && <Loader size="sm" />}
            Disable Follow
          </Button>
        )}
      </div>
    </div>
  )
}

export default RevertFollow
