import { useLazyQuery, useMutation } from '@apollo/client'
import useAppStore from '@lib/store'
import { ERROR_MESSAGE } from '@utils/constants'
import {
  AUTHENTICATE_MUTATION,
  CHALLENGE_QUERY,
  CURRENT_USER_QUERY
} from '@utils/gql/queries'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useSignMessage } from 'wagmi'

import ConnectWalletButton from './ConnectWalletButton'

const Login = () => {
  const { data: accountData } = useAccount()
  const { setChannels, setSelectedChannel, setToken } = useAppStore()
  const { signMessageAsync, isLoading: signing } = useSignMessage()

  const [loadChallenge, { error: errorChallenege }] =
    useLazyQuery(CHALLENGE_QUERY)
  const [authenticate, { error: errorAuthenticate }] = useMutation(
    AUTHENTICATE_MUTATION
  )
  const [getProfiles, { error: errorProfiles }] =
    useLazyQuery(CURRENT_USER_QUERY)

  useEffect(() => {
    if (
      errorAuthenticate?.message ||
      errorChallenege?.message ||
      errorProfiles?.message
    )
      toast.error(
        errorAuthenticate?.message ||
          errorChallenege?.message ||
          errorProfiles?.message ||
          ERROR_MESSAGE
      )
  }, [errorAuthenticate, errorChallenege, errorProfiles])

  const handleSign = () => {
    loadChallenge({
      variables: { request: { address: accountData?.address } }
    }).then((res) => {
      signMessageAsync({ message: res.data.challenge.text }).then(
        (signature) => {
          authenticate({
            variables: {
              request: { address: accountData?.address, signature }
            }
          }).then((res) => {
            const accessToken = res.data.authenticate.accessToken
            const refreshToken = res.data.authenticate.refreshToken
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            setToken({ access: accessToken, refresh: refreshToken })
            getProfiles({
              variables: { ownedBy: accountData?.address }
            }).then((res) => {
              if (res.data.profiles.items.length === 0) {
                setChannels([])
              } else {
                setSelectedChannel(res.data.profiles.items[0])
              }
            })
          })
        }
      )
    })
  }

  return <ConnectWalletButton handleSign={handleSign} loading={signing} />
}

export default Login
