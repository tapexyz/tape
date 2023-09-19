import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import SuperFollowOutline from '@components/Common/Icons/SuperFollowOutline'
import type { ButtonSizes, ButtonVariants } from '@components/UIElements/Button'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { getSignature } from '@lenstube/generic'
import type { FeeFollowModuleSettings, Profile } from '@lenstube/lens'
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useProfileFollowModuleQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onJoin: () => void
  variant?: ButtonVariants
  size?: ButtonSizes
  showText?: boolean
}

const JoinChannel: FC<Props> = ({
  channel,
  onJoin,
  variant = 'primary',
  size = 'md',
  showText = true
}) => {
  const [loading, setLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const { openConnectModal } = useConnectModal()

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
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
    onSuccess: () => onCompleted(),
    onError
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const { data: followModuleData } = useProfileFollowModuleQuery({
    variables: { request: { forProfileId: channel?.id } },
    skip: !channel?.id
  })

  const followModule = followModuleData?.profile
    ?.followModule as FeeFollowModuleSettings

  useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.contract.address,
        followModules: [FollowModuleType.FeeFollowModule],
        openActionModules: [],
        referenceModules: []
      }
    },
    skip:
      !followModule?.amount?.asset?.contract.address ||
      !selectedSimpleProfile?.id,
    onCompleted: ({ approvedModuleAllowanceAmount }) => {
      setIsAllowed(approvedModuleAllowanceAmount[0].allowance.value !== '0x00')
    }
  })

  const [createJoinChannelTypedData] = useCreateFollowTypedDataMutation({
    async onCompleted({ createFollowTypedData }) {
      const { typedData, id } = createFollowTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          const { idsOfProfilesToFollow, datas } = typedData.value
          return write?.({ args: [idsOfProfilesToFollow, datas] })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const joinChannel = () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (!isAllowed) {
      return toast.error(
        `Goto Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
    }
    setLoading(true)
    createJoinChannelTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profileId: channel?.id,
              followModule: {
                feeFollowModule: true
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
        <Button
          variant={variant}
          size={size}
          onClick={() => joinChannel()}
          loading={loading}
          icon={
            <SuperFollowOutline
              className={clsx({
                'h-2.5 w-2.5': size === 'sm',
                'h-3.5 w-3.5': size === 'md',
                'h-4 w-4': size === 'lg',
                'h-5 w-5': size === 'xl'
              })}
            />
          }
        >
          {showText && <Trans>Join Channel</Trans>}
        </Button>
      </span>
    </Tooltip>
  )
}

export default JoinChannel
