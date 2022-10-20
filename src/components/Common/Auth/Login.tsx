import { useLazyQuery, useMutation } from '@apollo/client'
import { PROFILES_QUERY } from '@gql/queries'
import { AUTHENTICATE_MUTATION, CHALLENGE_QUERY } from '@gql/queries/auth'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { ERROR_MESSAGE } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'

import { POLYGON_CHAIN_ID } from '../../../utils/constants'
import ConnectWalletButton from './ConnectWalletButton'

const Login = () => {
  const router = useRouter()
  const { address, connector, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const setShowCreateChannel = useAppStore(
    (state) => state.setShowCreateChannel
  )
  const setChannels = useAppStore((state) => state.setChannels)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { chain } = useNetwork()
  const [signatureRequested, setSignatureRequested] = useState(false)

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message)
    setLoading(false)
  }

  const { signMessageAsync } = useSignMessage({
    onError
  })

  const [loadChallenge, { error: errorChallenge }] = useLazyQuery(
    CHALLENGE_QUERY,
    {
      fetchPolicy: 'no-cache', // if cache old challenge persist issue (InvalidSignature)
      onError
    }
  )
  const [authenticate, { error: errorAuthenticate }] = useMutation(
    AUTHENTICATE_MUTATION
  )
  const [getChannels, { error: errorProfiles }] = useLazyQuery(PROFILES_QUERY, {
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
      const accessToken = result.data.authenticate.accessToken
      const refreshToken = result.data.authenticate.refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      const { data: channelsData } = await getChannels({
        variables: {
          request: { ownedBy: address }
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
        const channels: Profile[] = channelsData?.profiles?.items
        const defaultChannel = channels.find((channel) => channel.isDefault)
        setChannels(channels)
        setSelectedChannel(defaultChannel ?? channels[0])
        setSelectedChannelId(defaultChannel?.id ?? channels[0].id)
        if (router.query?.next) router.push(router.query?.next as string)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Failed to signin')
      logger.error('[Error Sign In]', error)
    }
  }

  useEffect(() => {
    if (
      connector?.id &&
      isConnected &&
      chain?.id === POLYGON_CHAIN_ID &&
      !selectedChannel &&
      !selectedChannelId &&
      !signatureRequested
    ) {
      setSignatureRequested(true)
      handleSign()
    }
  }, [connector, isConnected, chain])

  return (
    <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
  )
}

export default Login
