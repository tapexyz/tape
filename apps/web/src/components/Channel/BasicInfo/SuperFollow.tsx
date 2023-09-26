import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
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
import { Button } from '@radix-ui/themes'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useContractWrite, useSignTypedData } from 'wagmi'

type Props = {
  profile: Profile
  onJoin: () => void
  size?: '1' | '2' | '3'
  showText?: boolean
}

const SuperFollow: FC<Props> = ({ profile, onJoin, size = '2' }) => {
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
    toast.success(`Joined ${profile.handle}`)
    setLoading(false)
    Analytics.track(TRACK.CHANNEL.JOIN, {
      channel_id: profile.id,
      channel_name: profile.handle
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
    variables: { request: { forProfileId: profile?.id } },
    skip: !profile?.id
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
          const {
            followerProfileId,
            idsOfProfilesToFollow,
            followTokenIds,
            datas
          } = typedData.value
          return write?.({
            args: [
              followerProfileId,
              idsOfProfilesToFollow,
              followTokenIds,
              datas
            ]
          })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const joinChannel = async () => {
    if (!selectedSimpleProfile?.id) {
      return openConnectModal?.()
    }
    if (!isAllowed) {
      return toast.error(
        `Goto Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
    }
    setLoading(true)
    await createJoinChannelTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profileId: profile?.id,
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
    t`Super Follow`
  )

  return (
    <Tooltip content={joinTooltipText} placement="top">
      <span>
        <Button size={size} onClick={() => joinChannel()} disabled={loading}>
          <Trans>Super Follow</Trans>
        </Button>
      </span>
    </Tooltip>
  )
}

export default SuperFollow
