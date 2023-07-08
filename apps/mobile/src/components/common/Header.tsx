import Ionicons from '@expo/vector-icons/Ionicons'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { signOut } from '~/store/persist'

import AnimatedPressable from '../ui/AnimatedPressable'
import SignIn from './auth/SignIn'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rightView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  forYouText: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontWeight: '500',
    fontSize: normalizeFont(18)
  }
})

const Header: FC<HeaderTitleProps> = () => {
  const { provider } = useWalletConnectModal()
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>gm</Text>
      <View style={styles.rightView}>
        <AnimatedPressable
          onPress={() => {
            haptic()
          }}
        >
          <Ionicons
            name="add-circle-outline"
            color={theme.colors.white}
            size={25}
          />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => {
            haptic()
            signOut()
            provider?.disconnect()
            setSelectedChannel(null)
          }}
        >
          <Ionicons
            name="notifications-outline"
            color={theme.colors.white}
            size={23}
          />
        </AnimatedPressable>
        <SignIn />
      </View>
    </View>
  )
}

export default Header
