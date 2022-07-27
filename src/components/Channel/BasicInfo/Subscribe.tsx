import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import {
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import {
  BROADCAST_MUTATION,
  CREATE_FOLLOW_TYPED_DATA
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import useTxnToast from '@utils/hooks/useTxnToast'
import { utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CreateFollowBroadcastItemResult, Profile } from 'src/types'
import {
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Subscribe')
  const { isSignedUser } = usePersistStore()
  const { showToast } = useTxnToast()

  const onError = (error?: any) => {
    if (error) toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
    setButtonText('Subscribe')
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: signer } = useSigner({ onError })
  const { config: prepareSubscribe } = usePrepareContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'followWithSig'
  })
  const { write: writeSubscribe, data: writeData } = useContractWrite({
    ...prepareSubscribe,
    onSuccess(data) {
      setButtonText('Subscribing...')
      showToast(data.hash)
    },
    onError
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      showToast(data?.broadcast?.txHash)
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        setButtonText('Indexing...')
      }
    },
    onError
  })

  const { indexed } = usePendingTxn(
    writeData?.hash || broadcastData?.broadcast?.txHash
  )

  useEffect(() => {
    if (indexed) {
      onSubscribe()
      toast.success(`Subscribed to ${channel.handle}`)
      setButtonText('Subscribed')
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

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
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason)
            writeSubscribe?.({ recklesslySetUnpreparedArgs: args })
        } else {
          writeSubscribe?.({
            recklesslySetUnpreparedArgs: args
          })
        }
      } catch (error) {
        onError()
        logger.error('[Error Subscribe]', error)
      }
    },
    onError
  })

  const subscribe = () => {
    if (!isSignedUser) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    setButtonText('Subscribing...')
    createSubscribeTypedData({
      variables: {
        request: {
          follow: {
            profile: channel?.id
          }
        }
      }
    })
  }

  return (
    <Button onClick={() => subscribe()} disabled={loading}>
      {buttonText}
    </Button>
  )
}

export default Subscribe
