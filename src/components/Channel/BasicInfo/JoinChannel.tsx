import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/ui/Button'
import Tooltip from '@components/ui/Tooltip'
import { LENSHUB_PROXY_ADDRESS } from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import {
  CHANNEL_FOLLOW_MODULE_QUERY,
  CREATE_FOLLOW_TYPED_DATA
} from '@utils/gql/queries'
import { ethers, Signer, utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { FeeFollowModuleSettings, Profile } from 'src/types'
import { useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const JoinChannel: FC<Props> = ({ channel }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Join Channel')
  const { signTypedDataAsync } = useSignTypedData({
    onError() {
      setLoading(false)
    }
  })
  const { data: signer } = useSigner()

  const { data: followModuleData } = useQuery(CHANNEL_FOLLOW_MODULE_QUERY, {
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id
  })

  const [createJoinTypedData] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    onCompleted(data) {
      const typedData = data.createFollowTypedData.typedData
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      }).then(async (signature) => {
        const { v, r, s } = utils.splitSignature(signature)
        const lenshub = new ethers.Contract(
          LENSHUB_PROXY_ADDRESS,
          LENSHUB_PROXY_ABI,
          signer as Signer
        )
        const txn = await lenshub.followWithSig({
          follower: signer?.getAddress(),
          profileIds: typedData.value.profileIds,
          datas: typedData.value.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
        })
        if (txn.hash) {
          toast.success(`Joined ${channel.handle}`)
          setButtonText('Joined Channel')
          setLoading(false)
        }
      })
    },
    onError(error) {
      toast.error(error.message)
      setLoading(false)
      setButtonText('Join Channel')
    }
  })
  const channelFollowModule: FeeFollowModuleSettings =
    followModuleData?.profiles?.items[0]?.followModule

  const joinChannel = () => {
    setLoading(true)
    setButtonText('Joining...')
    createJoinTypedData({
      variables: {
        request: {
          follow: {
            profile: channel?.id,
            followModule: {
              feeFollowModule: {
                amount: {
                  currency: channelFollowModule?.amount?.asset?.address,
                  value: channelFollowModule?.amount?.value
                }
              }
            }
          }
        }
      }
    })
  }

  return (
    <Tooltip
      content={
        channelFollowModule
          ? `Pay ${channelFollowModule.amount.value} ${channelFollowModule.amount.asset.symbol}`
          : buttonText
      }
      placement="top"
    >
      <span>
        <Button onClick={() => joinChannel()} disabled={loading}>
          {buttonText}
        </Button>
      </span>
    </Tooltip>
  )
}

export default JoinChannel
