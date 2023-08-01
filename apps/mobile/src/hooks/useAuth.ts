import type { Profile } from '@lenstube/lens'
import { useUserProfilesQuery } from '@lenstube/lens'
import { useEffect, useState } from 'react'

import useMobileStore from '~/store'
import { hydrateAuthTokens, useMobilePersistStore } from '~/store/persist'

export const useAuth = (): boolean => {
  const [isValidated, setIsValidated] = useState(false)

  const { accessToken } = hydrateAuthTokens()

  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)
  const setUserSigNonce = useMobileStore((state) => state.setUserSigNonce)
  const setSelectedChannelId = useMobilePersistStore(
    (state) => state.setSelectedChannelId
  )
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  useEffect(() => {
    if (!accessToken || !selectedChannelId) {
      setIsValidated(true)
      resetAuthState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, selectedChannelId])

  useUserProfilesQuery({
    variables: {
      request: { profileIds: [selectedChannelId] }
    },
    skip: !accessToken || !selectedChannelId,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
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
