import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import { getSignature } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

const ToggleDispatcher = () => {
  const [loading, setLoading] = useState(false)

  const { activeProfile, setActiveProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const handleWrongNetwork = useHandleWrongNetwork()

  const isLensManagerEnabled = activeProfile?.lensManager || false

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'changeDelegatedExecutorsConfig',
    onSuccess: () => {
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId:
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      toast.success(
        `Dispatcher ${isLensManagerEnabled ? t`disabled` : t`enabled`}`
      )
      const channel = { ...activeProfile }
      channel.lensManager = isLensManagerEnabled ? false : true
      setActiveProfile(channel as Profile)
      setLoading(false)
      Analytics.track(TRACK.DISPATCHER.TOGGLE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [toggleLensManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          const {
            delegatorProfileId,
            delegatedExecutors,
            approvals,
            configNumber,
            switchToGivenConfig
          } = typedData.value
          return write?.({
            args: [
              delegatorProfileId,
              delegatedExecutors,
              approvals,
              configNumber,
              switchToGivenConfig
            ]
          })
        }
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
    toggleLensManager({
      variables: {
        request: {
          approveLensManager: !isLensManagerEnabled
        }
      }
    })
  }

  const getButtonText = () => {
    if (isLensManagerEnabled) {
      return t`Disable`
    } else {
      return t`Enable`
    }
  }

  return (
    <Button
      color={isLensManagerEnabled ? 'red' : 'gray'}
      highContrast={!isLensManagerEnabled}
      size="3"
      onClick={onClick}
      disabled={loading}
    >
      {loading && <Loader size="sm" />}
      {getButtonText()} <Trans>dispatcher</Trans>
    </Button>
  )
}

export default ToggleDispatcher
