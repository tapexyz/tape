import { useLazyQuery, useMutation } from '@apollo/client'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
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
  const { address } = useAccount()
  const { setChannels, setShowCreateChannel } = useAppStore()
  const { setIsAuthenticated, setSelectedChannel, setIsSignedUser } =
    usePersistStore()
  const { signMessageAsync, isLoading: signing } = useSignMessage({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [loadChallenge, { error: errorChallenge, loading: loadingChallenge }] =
    useLazyQuery(CHALLENGE_QUERY, {
      fetchPolicy: 'no-cache' // if cache old challenge persist issue (InvalidSignature)
    })
  const [authenticate, { error: errorAuthenticate }] = useMutation(
    AUTHENTICATE_MUTATION
  )
  const [getChannels, { error: errorProfiles }] = useLazyQuery(
    CURRENT_USER_QUERY,
    {
      fetchPolicy: 'no-cache'
    }
  )

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

  const handleSign = async () => {
    try {
      const challenge = await loadChallenge({
        variables: { request: { address } }
      })
      if (!challenge?.data?.challenge?.text) return toast.error(ERROR_MESSAGE)
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      })
      const result = await authenticate({
        variables: { request: { address, signature } }
      })
      const accessToken = result.data.authenticate.accessToken
      const refreshToken = result.data.authenticate.refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      const { data: channelsData } = await getChannels({
        variables: { ownedBy: address }
      })
      setIsSignedUser(true)
      if (
        !channelsData?.profiles ||
        channelsData?.profiles?.items.length === 0
      ) {
        setSelectedChannel(null)
        setIsAuthenticated(false)
        setShowCreateChannel(true)
      } else {
        const channels: Profile[] = channelsData?.profiles?.items
        setChannels(channels)
        setSelectedChannel(channelsData.profiles.items[0])
        setIsAuthenticated(true)
        if (router.query?.next) router.push(router.query?.next as string)
      }
    } catch (error) {
      logger.error('[Error Sign In]', error)
    }
  }

  return (
    <ConnectWalletButton
      handleSign={handleSign}
      signing={signing || loadingChallenge}
    />
  )
}

export default Login
