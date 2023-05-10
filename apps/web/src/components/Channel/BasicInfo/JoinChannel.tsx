import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FeeFollowModuleSettings, Profile } from 'lens'
import {
  FollowModules,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProfileFollowModuleQuery
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import getSignature from 'utils/functions/getSignature'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onJoin: () => void
}

const JoinChannel: FC<Props> = ({ channel, onJoin }) => {
  const [loading, setLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const { openConnectModal } = useConnectModal()

  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onJoin()
    toast.success(`Joined ${channel.handle}`)
    setLoading(false)
    Analytics.track(TRACK.CHANNEL.JOIN, {
      channel_id: channel.id,
      channel_name: channel.handle
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'follow',
    onSuccess: onCompleted,
    onError
  })

  const [broadcast] = useBroadcastMutation({
    onCompleted,
    onError
  })

  const { data: followModuleData } = useProfileFollowModuleQuery({
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id
  })

  const followModule = followModuleData?.profiles?.items[0]
    ?.followModule as FeeFollowModuleSettings

  useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.address,
        followModules: [FollowModules.FeeFollowModule],
        collectModules: [],
        referenceModules: []
      }
    },
    skip: !followModule?.amount?.asset?.address || !selectedChannelId,
    onCompleted: (data) => {
      setIsAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
    }
  })

  const [createJoinTypedData] = useCreateFollowTypedDataMutation({
    async onCompleted({ createFollowTypedData }) {
      const { typedData, id } = createFollowTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast.__typename === 'RelayError') {
          write?.({ args: [typedData.value] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const joinChannel = () => {
    if (!selectedChannelId) {
      return openConnectModal?.()
    }
    if (!isAllowed) {
      return toast.error(
        `Goto Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
    }
    setLoading(true)
    createJoinTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profile: channel?.id,
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: followModule?.amount?.asset?.address,
                    value: followModule?.amount?.value
                  }
                }
              }
            }
          ]
        }
      }
    })
  }

  const joinTooltipText = followModule ? (
    <span>
      <Trans>Pay Membership of</Trans>
      <b className="ml-1 space-x-1">
        <span>{followModule?.amount?.value}</span>
        <span>{followModule?.amount?.asset.symbol}</span>
      </b>
    </span>
  ) : (
    t`Join Channel`
  )

  return (
    <Tooltip content={joinTooltipText} placement="top">
      <span>
        <Button onClick={() => joinChannel()} loading={loading}>
          <Trans>Join Channel</Trans>
        </Button>
      </span>
    </Tooltip>
  )
}

export default JoinChannel
