import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import {
  LENSHUB_PROXY_ADDRESS,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { CREATE_FOLLOW_TYPED_DATA } from '@utils/gql/queries'
import { ethers, Signer, utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { Profile } from 'src/types'
import { useSigner, useSignTypedData } from 'wagmi'

type Props = {
  channel: Profile
}

const Subscribe: FC<Props> = ({ channel }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Subscribe')
  const { isAuthenticated } = useAppStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError() {
      setLoading(false)
    }
  })
  const { data: signer } = useSigner()

  const [createSubscribeTypedData] = useMutation(CREATE_FOLLOW_TYPED_DATA, {
    onCompleted(data) {
      const typedData = data.createFollowTypedData.typedData
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      })
        .then(async (signature) => {
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
            toast.success(`Subscribed to ${channel.handle}`)
            setButtonText('Subscribed')
            setLoading(false)
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
