import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { BROADCAST_MUTATION } from '@gql/queries'
import { PROXY_ACTION_MUTATION } from '@gql/queries/proxy-action'
import { CREATE_FOLLOW_TYPED_DATA } from '@gql/queries/typed-data'
import logger from '@lib/logger'
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
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateFollowBroadcastItemResult, Profile } from 'src/types'
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onSubscribe()
    toast.success(`Subscribed to ${channel.handle}`)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: signer } = useSigner({ onError })

  const { write: writeSubscribe } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  })

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        onCompleted()
      }
    },
    onError
  })

  const [createProxyActionFreeFollow] = useMutation(PROXY_ACTION_MUTATION, {
    onError,
    onCompleted
  })

  const [createSubscribeTypedData] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createFollowTypedData as CreateFollowBroadcastItemResult
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const { profileIds, datas } = typedData?.value
        const args = {
          follower: signer?.getAddress(),
          profileIds,
          datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
        }
        if (!RELAYER_ENABLED) {
          return writeSubscribe?.({
            recklesslySetUnpreparedArgs: [args]
          })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.reason)
          writeSubscribe?.({ recklesslySetUnpreparedArgs: [args] })
      } catch (error) {
        logger.error('[Error Subscribe Typed Data]', error)
      }
    },
    onError
  })

  const subscribe = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    if (channel.followModule) {
      return createSubscribeTypedData({
        variables: {
          request: {
            follow: {
              profile: channel?.id,
              followModule:
                channel?.followModule?.__typename ===
                'ProfileFollowModuleSettings'
                  ? { profileFollowModule: { profileId: selectedChannel?.id } }
                  : null
            }
          }
        }
      })
    }
    createProxyActionFreeFollow({
      variables: {
        request: {
          follow: {
            freeFollow: {
              profileId: channel?.id
            }
          }
        }
      }
    })
  }

  return (
    <Button onClick={() => subscribe()} loading={loading} disabled={loading}>
      Subscribe
    </Button>
  )
}

export default Subscribe
