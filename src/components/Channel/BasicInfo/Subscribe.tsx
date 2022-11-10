import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
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
import {
  BroadcastDocument,
  CreateFollowBroadcastItemResult,
  CreateFollowTypedDataDocument,
  Profile,
  ProxyActionDocument
} from 'src/types/lens'
import { CustomErrorWithData } from 'src/types/local'
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    onSubscribe()
    toast.success(`Subscribed to ${channel.handle}`)
    setLoading(false)
    Analytics.track(TRACK.SUBSCRIBE_CHANNEL)
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

  const [broadcast] = useMutation(BroadcastDocument, {
    onCompleted(data) {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted()
      }
    },
    onError
  })

  const [createProxyActionFreeFollow] = useMutation(ProxyActionDocument, {
    onError,
    onCompleted
  })

  const [createSubscribeTypedData] = useMutation(
    CreateFollowTypedDataDocument,
    {
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
          if (data?.broadcast?.__typename === 'RelayError')
            writeSubscribe?.({ recklesslySetUnpreparedArgs: [args] })
        } catch (error) {
          logger.error('[Error Subscribe Typed Data]', error)
        }
      },
      onError
    }
  )

  const subscribe = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    if (channel.followModule) {
      if (channel?.followModule?.__typename === 'ProfileFollowModuleSettings') {
        toast('Requesting signature...')
      }
      return createSubscribeTypedData({
        variables: {
          request: {
            follow: [
              {
                profile: channel.id,
                followModule:
                  channel?.followModule?.__typename ===
                  'ProfileFollowModuleSettings'
                    ? {
                        profileFollowModule: { profileId: selectedChannel?.id }
                      }
                    : null
              }
            ]
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
