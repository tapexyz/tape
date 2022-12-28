import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { Profile } from 'lens'
import {
  useAllProfilesLazyQuery,
  useAuthenticateMutation,
  useChallengeLazyQuery
} from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'utils'
import clearLocalStorage from 'utils/functions/clearLocalStorage'
import logger from 'utils/logger'
import { useAccount, useSignMessage } from 'wagmi'

import ConnectWalletButton from './ConnectWalletButton'

const Login = () => {
  const router = useRouter()
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const setShowCreateChannel = useAppStore(
    (state) => state.setShowCreateChannel
  )
  const setChannels = useAppStore((state) => state.setChannels)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const onError = () => {
    setLoading(false)
    clearLocalStorage()
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  const { signMessageAsync } = useSignMessage({
    onError
  })

  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache', // if cache old challenge persist issue (InvalidSignature)
    onError
  })
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation()
  const [getChannels, { error: errorProfiles }] = useAllProfilesLazyQuery({
    fetchPolicy: 'no-cache'
  })

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
      setLoading(true)
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
      const accessToken = result.data?.authenticate.accessToken
      const refreshToken = result.data?.authenticate.refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      const { data: channelsData } = await getChannels({
        variables: {
          request: { ownedBy: [address] }
        }
      })
      if (
        !channelsData?.profiles ||
        channelsData?.profiles?.items.length === 0
      ) {
        setSelectedChannel(null)
        setSelectedChannelId(null)
        setShowCreateChannel(true)
      } else {
        const channels = channelsData?.profiles?.items as Profile[]
        const defaultChannel = channels.find((channel) => channel.isDefault)
        setChannels(channels)
        setSelectedChannel(defaultChannel ?? channels[0])
        setSelectedChannelId(defaultChannel?.id ?? channels[0].id)
        if (router.query?.next) router.push(router.query?.next as string)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Sign in failed')
      clearLocalStorage()
      logger.error('[Error Sign In]', error)
    }
  }

  return (
    <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
  )
}

export default Login
