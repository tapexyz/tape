import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
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
import { utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Profile } from 'src/types'
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Subscribe')
  const { isAuthenticated } = usePersistStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError() {
      setLoading(false)
    }
  })
  const { data: signer } = useSigner()
  const { write: writeSubscribe, data: writeData } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'followWithSig',
    {
      onSuccess() {
        setButtonText('Subscribing...')
      },
      onError(error: any) {
        toast.error(`Failed - ${error?.data?.message ?? error?.message}`)
        setLoading(false)
        setButtonText('Subscribe')
      }
    }
  )
  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        setButtonText('Indexing...')
      }
    },
    onError(error) {
      toast.error(error.message)
      setLoading(false)
      setButtonText('Subscribe')
    }
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
    onCompleted(data) {
      const { typedData, id } = data.createFollowTypedData
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      })
        .then(async (signature) => {
          const { profileIds, datas } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
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
            broadcast({ variables: { request: { id, signature } } })
          } else {
            writeSubscribe({
              args
            })
          }
        })
        .catch((err) => {
          toast.error(err.message)
          setLoading(false)
          setButtonText('Subscribe')
        })
    },
    onError() {
      setButtonText('Subscribe')
      setLoading(false)
    }
  })

  const subscribe = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
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
