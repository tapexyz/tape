import { ALLOWED_HEX_CHARACTERS } from '@lenstube/constants'
import type { Profile } from '@lenstube/lens'
import { useUserProfilesQuery } from '@lenstube/lens'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { useMobilePersistStore } from '~/store/persist'

const styles = StyleSheet.create({
  background: {
    flex: 1
  }
})

const Container: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useWalletConnectModal()

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

  useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !address,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    },
    onError: () => {
      setSelectedChannelId(null)
    }
  })

  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)
  const setHomeGradientColor = useMobileStore(
    (state) => state.setHomeGradientColor
  )

  const generateJustOneColor = () => {
    if (homeGradientColor !== theme.colors.black) {
      return `${homeGradientColor}35`
    }
    let hexColorRep = '#'
    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(
        Math.random() * ALLOWED_HEX_CHARACTERS.length
      )
      hexColorRep += ALLOWED_HEX_CHARACTERS[randomPosition]
    }
    setHomeGradientColor(hexColorRep)
    return (hexColorRep += '35')
  }

  return (
    <LinearGradient
      colors={[generateJustOneColor(), 'transparent']}
      // start={{ x: 1, y: 0.2 }}
      style={styles.background}
      locations={[0, 0.9]}
    >
      {children}
    </LinearGradient>
  )
}

export default Container
