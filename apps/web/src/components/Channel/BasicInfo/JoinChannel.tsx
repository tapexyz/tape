import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { utils } from 'ethers'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { FeeFollowModuleSettings, Profile } from 'src/types/lens'
import {
  FollowModules,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastMutation,
  useCreateFollowTypedDataMutation,
  useProfileFollowModuleQuery
} from 'src/types/lens'
import type { CustomErrorWithData } from 'src/types/local'
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onJoin: () => void
}

const JoinChannel: FC<Props> = ({ channel, onJoin }) => {
  const [loading, setLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onJoin()
    toast.success(`Joined ${channel.handle}`)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: signer } = useSigner({ onError })

  const { write: writeJoinChannel } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
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
    async onCompleted(data) {
      const { typedData, id } = data.createFollowTypedData
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          follower: signer?.getAddress(),
          profileIds: typedData.value.profileIds,
          datas: typedData.value.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
        }
        setUserSigNonce(userSigNonce + 1)
        if (!RELAYER_ENABLED) {
          return writeJoinChannel?.({ recklesslySetUnpreparedArgs: [args] })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast.__typename === 'RelayError')
          writeJoinChannel?.({ recklesslySetUnpreparedArgs: [args] })
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const joinChannel = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    if (!isAllowed)
      return toast.error(
        `Goto Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
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
      Pay Membership of
      <b className="ml-1 space-x-1">
        <span>{followModule?.amount?.value}</span>
        <span>{followModule?.amount?.asset.symbol}</span>
      </b>
    </span>
  ) : (
    'Join Channel'
  )

  return (
    <Tooltip content={joinTooltipText} placement="top">
      <span>
        <Button
          onClick={() => joinChannel()}
          loading={loading}
          disabled={loading}
        >
          Join Channel
        </Button>
      </span>
    </Tooltip>
  )
}

export default JoinChannel
