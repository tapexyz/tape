import Ionicons from '@expo/vector-icons/Ionicons'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import { MotiPressable } from 'moti/interactions'
import type { FC } from 'react'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

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
    color: theme.colors.primary,
    fontFamily: 'font-bold',
    fontWeight: '500',
    fontSize: normalizeFont(18)
  }
})

const Header: FC<HeaderTitleProps> = () => {
  const { provider } = useWalletConnectModal()

  const animatePress = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        'worklet'
        return {
          scale: pressed ? 0.9 : 1
        }
      },
    []
  )

  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>gm</Text>
      <View style={styles.rightView}>
        <MotiPressable
          onPress={() => {
            haptic()
          }}
          animate={animatePress}
        >
          <Ionicons
            name="add-circle-outline"
            color={theme.colors.white}
            size={25}
          />
        </MotiPressable>
        <MotiPressable
          onPress={() => {
            haptic()
            provider?.disconnect()
          }}
          animate={animatePress}
        >
          <Ionicons
            name="notifications-outline"
            color={theme.colors.white}
            size={23}
          />
        </MotiPressable>
        <SignIn />
      </View>
    </View>
  )
}

export default Header
