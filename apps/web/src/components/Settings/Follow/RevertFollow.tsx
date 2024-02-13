import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
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
import type {
  CreateSetFollowModuleBroadcastItemResult,
  Profile
} from '@tape.xyz/lens'
import {
  FollowModuleType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Spinner } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

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
    mutation: { onError }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { data: txHash, writeContractAsync } = useWriteContract({
    mutation: {
      onError
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'setFollowModule',
      args
    })
  }

  const { indexed } = usePendingTxn({
    txHash,
    ...(broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' && {
      txId: broadcastData?.broadcastOnchain?.txId
    })
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
        const { typedData, id } =
          createSetFollowModuleTypedData as CreateSetFollowModuleBroadcastItemResult
        const { profileId, followModule, followModuleInitData } =
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
              return await write({ args })
            }
            return onCompleted(data?.broadcastOnchain?.__typename)
          }
          return await write({ args })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const toggleRevert = async (revertFollowModule: boolean) => {
    await handleWrongNetwork()

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
    <>
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
            loading={loading}
            onClick={() => toggleRevert(false)}
          >
            Enable Follow
          </Button>
        ) : (
          <Button
            variant="danger"
            loading={loading}
            disabled={loading}
            onClick={() => toggleRevert(true)}
          >
            {loading && <Spinner size="sm" />}
            Disable Follow
          </Button>
        )}
      </div>
    </>
  )
}

export default RevertFollow
