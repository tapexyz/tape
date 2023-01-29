import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import usePendingTxn from '@hooks/usePendingTxn'
import useAppStore from '@lib/store'
import { utils } from 'ethers'
import type { CreateSetDispatcherBroadcastItemResult, Profile } from 'lens'
import {
  useBroadcastMutation,
  useCreateSetDispatcherTypedDataMutation,
  useProfileLazyQuery
} from 'lens'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import { Analytics, ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, TRACK } from 'utils'
import omitKey from 'utils/functions/omitKey'
import { useContractWrite, useSignTypedData } from 'wagmi'

const Toggle = () => {
  const [loading, setLoading] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const canUseRelay = selectedChannel?.dispatcher?.canUseRelay

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeDispatch, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onError
  })

  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId:
      broadcastData?.broadcast.__typename === 'RelayerResult'
        ? broadcastData?.broadcast?.txId
        : undefined
  })

  const [refetchChannel] = useProfileLazyQuery({
    onCompleted: (data) => {
      const channel = data?.profile as Profile
      setSelectedChannel(channel)
    }
  })

  useEffect(() => {
    if (indexed) {
      toast.success(`Dispatcher ${canUseRelay ? 'disabled' : 'enabled'}`)
      Analytics.track(TRACK.DISPATCHER_ENABLED)
      refetchChannel({
        variables: {
          request: { handle: selectedChannel?.handle }
        },
        fetchPolicy: 'no-cache'
      })
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createDispatcherTypedData] = useCreateSetDispatcherTypedDataMutation({
    onCompleted: async ({ createSetDispatcherTypedData }) => {
      const { id, typedData } =
        createSetDispatcherTypedData as CreateSetDispatcherBroadcastItemResult
      const { deadline } = typedData?.value
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { profileId, dispatcher } = typedData?.value
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          profileId,
          dispatcher,
          sig: { v, r, s, deadline }
        }
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError')
          writeDispatch?.({ recklesslySetUnpreparedArgs: [args] })
      } catch {
        setLoading(false)
      }
    },
    onError
  })
  const onClick = () => {
    setLoading(true)
    createDispatcherTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: selectedChannel?.id,
          enable: !canUseRelay
        }
      }
    })
  }

  return (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      onClick={onClick}
      loading={loading}
    >
      {canUseRelay ? 'Disable' : 'Enable'} dispatcher
    </Button>
  )
}

export default Toggle
