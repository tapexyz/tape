import { useLazyQuery, useMutation } from '@apollo/client'
import useAppStore from '@lib/store'
import { ERROR_MESSAGE } from '@utils/constants'
import {
  AUTHENTICATE_MUTATION,
  CHALLENGE_QUERY,
  CURRENT_USER_QUERY
} from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useSignMessage } from 'wagmi'

const ConnectWalletButton = dynamic(() => import('./ConnectWalletButton'))

const Login = () => {
  const router = useRouter()
  const { data: accountData } = useAccount()
  const {
    setChannels,
    setSelectedChannel,
    setIsAuthenticated,
    setShowCreateChannel
  } = useAppStore()
  const { signMessageAsync, isLoading: signing } = useSignMessage()

  const [loadChallenge, { error: errorChallenge, loading: loadingChallenge }] =
    useLazyQuery(CHALLENGE_QUERY, {
      fetchPolicy: 'no-cache' // if cache old challenge persist issue (InvalidSignature)
    })
  const [authenticate, { error: errorAuthenticate }] = useMutation(
    AUTHENTICATE_MUTATION
  )
  const [getProfiles, { error: errorProfiles }] =
    useLazyQuery(CURRENT_USER_QUERY)

  useEffect(() => {
    if (
      errorAuthenticate?.message ||
      errorChallenge?.message ||
      errorProfiles?.message
    )
      toast.error(
        errorAuthenticate?.message ||
          errorChallenge?.message ||
          errorProfiles?.message ||
          ERROR_MESSAGE
      )
  }, [errorAuthenticate, errorChallenge, errorProfiles])

  const handleSign = () => {
    loadChallenge({
      variables: { request: { address: accountData?.address } }
    }).then((res) => {
      signMessageAsync({ message: res.data?.challenge.text }).then(
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
            getProfiles({
              variables: { ownedBy: accountData?.address }
            }).then((res) => {
              if (res.data.profiles.items.length === 0) {
                setShowCreateChannel(true)
                setSelectedChannel(null)
                setIsAuthenticated(false)
              } else {
                const channels: Profile[] = res?.data?.profiles?.items
                setChannels(channels)
                setSelectedChannel(res.data.profiles.items[0])
                setIsAuthenticated(true)
                if (router.query?.next) {
                  router.push(router.query?.next as string)
                }
              }
            })
          })
        }
      )
    })
  }

  return (
    <ConnectWalletButton
      handleSign={handleSign}
      signing={signing || loadingChallenge}
    />
  )
}

export default Login
