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
import type { Profile } from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'

const ToggleLensManager = () => {
  const [loading, setLoading] = useState(false)

  const { activeProfile, setActiveProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const isLensManagerEnabled = activeProfile?.signless || false

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContract, data: writeHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writeHash,
    txId:
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      toast.success(
        `Lens Manager ${isLensManagerEnabled ? `disabled` : `enabled`}`
      )
      const channel = { ...activeProfile }
      channel.signless = isLensManagerEnabled ? false : true
      setActiveProfile(channel as Profile)
      setLoading(false)
      Tower.track(EVENTS.MANAGER.TOGGLE, { enabled: channel.signless })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [toggleLensManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData
      const {
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      } = typedData.value
      const args = [
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      ]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return writeContract({
              address: LENSHUB_PROXY_ADDRESS,
              abi: LENSHUB_PROXY_ABI,
              functionName: 'changeDelegatedExecutorsConfig',
              args
            })
          }
          return
        }
        return writeContract({
          address: LENSHUB_PROXY_ADDRESS,
          abi: LENSHUB_PROXY_ABI,
          functionName: 'changeDelegatedExecutorsConfig',
          args
        })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const onClick = () => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    return toggleLensManager({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          approveSignless: !isLensManagerEnabled
        }
      }
    })
  }

  const getButtonText = () => {
    if (isLensManagerEnabled) {
      return `Disable`
    } else {
      return `Enable`
    }
  }

  return (
    <Button
      color={isLensManagerEnabled ? 'red' : 'gray'}
      highContrast={!isLensManagerEnabled}
      variant="surface"
      onClick={onClick}
      disabled={loading}
    >
      {loading && <Loader size="sm" />}
      {getButtonText()}
    </Button>
  )
}

export default ToggleLensManager
