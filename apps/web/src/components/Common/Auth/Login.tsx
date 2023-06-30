import { Analytics, TRACK } from '@lenstube/browser'
import { ERROR_MESSAGE, POLYGON_CHAIN_ID } from '@lenstube/constants'
import { logger } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import {
  useAllProfilesLazyQuery,
  useAuthenticateMutation,
  useChallengeLazyQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore, { signIn, signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'

import ConnectWalletButton from './ConnectWalletButton'

const Login = () => {
  const router = useRouter()

  const { chain } = useNetwork()
  const { address, connector, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const setShowCreateChannel = useChannelStore(
    (state) => state.setShowCreateChannel
  )
  const setChannels = useChannelStore((state) => state.setChannels)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const setSelectedChannelId = useAuthPersistStore(
    (state) => state.setSelectedChannelId
  )

  const onError = () => {
    setLoading(false)
    signOut()
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
      errorAuthenticate?.message ??
      errorChallenge?.message ??
      errorProfiles?.message
    ) {
      toast.error(
        errorAuthenticate?.message ??
          errorChallenge?.message ??
          errorProfiles?.message ??
          ERROR_MESSAGE
      )
    }
  }, [errorAuthenticate, errorChallenge, errorProfiles])

  const isReadyToSign =
    connector?.id &&
    isConnected &&
    chain?.id === POLYGON_CHAIN_ID &&
    !selectedChannel &&
    !selectedChannelId

  const handleSign = useCallback(async () => {
    if (!isReadyToSign) {
      disconnect?.()
      signOut()
      return toast.error(t`Please connect to your wallet`)
    }
    try {
      setLoading(true)
      const challenge = await loadChallenge({
        variables: { request: { address } }
      })
      if (!challenge?.data?.challenge?.text) {
        return toast.error(ERROR_MESSAGE)
      }
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      })
      if (!signature) {
        return toast.error(t`Invalid Signature!`)
      }
      const result = await authenticate({
        variables: { request: { address, signature } }
      })
      const accessToken = result.data?.authenticate.accessToken
      const refreshToken = result.data?.authenticate.refreshToken
      signIn({ accessToken, refreshToken })
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
        if (router.query?.next) {
          router.push(router.query?.next as string)
        }
      }
      setLoading(false)
      Analytics.track(TRACK.AUTH.SIGN_IN_WITH_LENS)
    } catch (error) {
      signOut()
      setLoading(false)
      toast.error(t`Sign in failed`)
      logger.error('[Error Sign In]', {
        error,
        connector: connector?.name
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    authenticate,
    getChannels,
    loadChallenge,
    router,
    setChannels,
    setSelectedChannel,
    setSelectedChannelId,
    setShowCreateChannel,
    signMessageAsync
  ])

  useEffect(() => {
    if (isReadyToSign) {
      handleSign()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  return (
    <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
  )
}

export default Login
