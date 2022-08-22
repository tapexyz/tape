import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import usePersistStore from '@lib/store/persist'
import { ERROR_MESSAGE, SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { PROXY_ACTION_MUTATION } from '@utils/gql/proxy-action'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
  onSubscribe: () => void
}

const Subscribe: FC<Props> = ({ channel, onSubscribe }) => {
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Subscribe')
  const isSignedUser = usePersistStore((state) => state.isSignedUser)

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setButtonText('Subscribe')
  }

  const onCompleted = () => {
    onSubscribe()
    toast.success(`Subscribed to ${channel.handle}`)
    setButtonText('Subscribed')
    setLoading(false)
  }

  const [createProxyActionFreeFollow] = useMutation(PROXY_ACTION_MUTATION, {
    onError,
    onCompleted
  })

  const subscribe = () => {
    if (!isSignedUser) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    setLoading(true)
    setButtonText('Subscribing...')
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
    <Button onClick={() => subscribe()} disabled={loading}>
      {buttonText}
    </Button>
  )
}

export default Subscribe
