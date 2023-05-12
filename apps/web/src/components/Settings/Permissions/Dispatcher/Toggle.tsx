import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import usePendingTxn from '@hooks/usePendingTxn'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import type { CreateSetDispatcherBroadcastItemResult, Profile } from 'lens'
import {
  useBroadcastMutation,
  useCreateSetDispatcherTypedDataMutation,
  useProfileLazyQuery
} from 'lens'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  OLD_LENS_RELAYER_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import getIsDispatcherEnabled from 'utils/functions/getIsDispatcherEnabled'
import getSignature from 'utils/functions/getSignature'
import { useContractWrite, useSignTypedData } from 'wagmi'

const Toggle = () => {
  const [loading, setLoading] = useState(false)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const canUseRelay = getIsDispatcherEnabled(selectedChannel)
  const usingOldDispatcher =
    selectedChannel?.dispatcher?.address?.toLocaleLowerCase() ===
    OLD_LENS_RELAYER_ADDRESS.toLocaleLowerCase()

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
    functionName: 'setDispatcher',
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
      toast.success(`Dispatcher ${canUseRelay ? t`disabled` : t`enabled`}`)
      refetchChannel({
        variables: {
          request: { handle: selectedChannel?.handle }
        },
        fetchPolicy: 'no-cache'
      })
      setLoading(false)
      Analytics.track(TRACK.DISPATCHER.TOGGLE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createDispatcherTypedData] = useCreateSetDispatcherTypedDataMutation({
    onCompleted: async ({ createSetDispatcherTypedData }) => {
      const { id, typedData } =
        createSetDispatcherTypedData as CreateSetDispatcherBroadcastItemResult
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          const { profileId, dispatcher } = typedData.value
          return write?.({
            args: [profileId, dispatcher]
          })
        }
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

  const getButtonText = () => {
    if (usingOldDispatcher) {
      return t`Upgrade`
    } else if (canUseRelay) {
      return t`Disable`
    } else {
      return t`Enable`
    }
  }

  return (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      onClick={onClick}
      loading={loading}
    >
      {getButtonText()} <Trans>dispatcher</Trans>
    </Button>
  )
}

export default Toggle
