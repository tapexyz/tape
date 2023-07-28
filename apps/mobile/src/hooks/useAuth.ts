import type { Profile } from '@lenstube/lens'
import { useUserProfilesQuery } from '@lenstube/lens'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { useEffect, useState } from 'react'

import useMobileStore from '~/store'
import { hydrateAuthTokens, useMobilePersistStore } from '~/store/persist'

export const useAuth = (): boolean => {
  const [isValidated, setIsValidated] = useState(false)

  const { address } = useWalletConnectModal()
  const { accessToken } = hydrateAuthTokens()

  const setChannels = useMobileStore((state) => state.setChannels)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)
  const setUserSigNonce = useMobileStore((state) => state.setUserSigNonce)
  const setSelectedChannelId = useMobilePersistStore(
    (state) => state.setSelectedChannelId
  )
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const setUserChannels = (channels: Profile[]) => {
    setChannels(channels)
    const channel = channels.find((ch) => ch.id === selectedChannelId)
    setSelectedChannel(channel ?? channels[0])
    setSelectedChannelId(channel?.id)
  }

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  useEffect(() => {
    if (!accessToken || !address) {
      setIsValidated(true)
      resetAuthState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, address])

  useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !accessToken || !address,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
      setIsValidated(true)
    },
    onError: () => {
      resetAuthState()
      setIsValidated(true)
    }
  })

  return isValidated
}
