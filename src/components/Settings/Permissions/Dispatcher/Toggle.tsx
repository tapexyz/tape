import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { CREATE_SET_DISPATCHER_TYPED_DATA } from '@utils/gql/dispatcher'
import { BROADCAST_MUTATION, PROFILE_QUERY } from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { Mixpanel, TRACK } from '@utils/track'
import { utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateSetDispatcherBroadcastItemResult, Profile } from 'src/types'
import { useContractWrite, useSignTypedData } from 'wagmi'

const Toggle = () => {
  const [loading, setLoading] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const canUseRelay = selectedChannel?.dispatcher?.canUseRelay

  const onError = (error: any) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeDispatch, data: writeData } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onError
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId: broadcastData ? broadcastData?.broadcast?.txId : undefined
  })

  const [refetchChannel] = useLazyQuery(PROFILE_QUERY, {
    onCompleted(data) {
      const channels: Profile[] = data?.profiles?.items
      setSelectedChannel(channels[0])
    }
  })

  useEffect(() => {
    if (indexed) {
      toast.success(`Dispatcher ${canUseRelay ? 'disabled' : 'enabled'}`)
      Mixpanel.track(TRACK.DISPATCHER_ENABLED)
      refetchChannel({
        variables: {
          request: { handles: selectedChannel?.handle }
        },
        fetchPolicy: 'no-cache'
      })
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createDispatcherTypedData] = useMutation(
    CREATE_SET_DISPATCHER_TYPED_DATA,
    {
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
          if (RELAYER_ENABLED) {
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcast?.reason)
              writeDispatch?.({ recklesslySetUnpreparedArgs: args })
          } else {
            writeDispatch?.({ recklesslySetUnpreparedArgs: args })
          }
        } catch (error) {
          logger.error('[Error Set Dispatcher]', error)
        }
      },
      onError
    }
  )
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
      disabled={loading}
      loading={loading}
    >
      {canUseRelay ? 'Disable' : 'Enable'} dispatcher
    </Button>
  )
}

export default Toggle
