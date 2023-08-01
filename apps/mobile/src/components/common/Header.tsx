import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'
import { signOut } from '~/store/persist'

import Menu from '../profile/Menu'
import MenuItem from '../profile/MenuItem'
import Switch from '../profile/Switch'
import AnimatedPressable from '../ui/AnimatedPressable'
import Sheet from '../ui/Sheet'
import AppInfo from './AppInfo'
import SignIn from './auth/SignIn'
import UserProfile from './UserProfile'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5
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
  const profileSheetRef = useRef<BottomSheetModal>(null)
  const { provider } = useWalletConnectModal()

  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const logout = () => {
    signOut()
    provider?.disconnect()
    setSelectedChannel(null)
    haptic()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>gm</Text>
      <View style={styles.rightView}>
        {selectedChannel && (
          <AnimatedPressable
            onPress={() => {
              haptic()
            }}
          >
            <Ionicons
              name="create-outline"
              color={theme.colors.white}
              size={20}
            />
          </AnimatedPressable>
        )}

        {selectedChannel ? (
          <>
            <UserProfile
              profile={selectedChannel}
              showHandle={false}
              onPress={() => profileSheetRef.current?.present()}
            />
            <Sheet sheetRef={profileSheetRef} snap={['60%']}>
              <ScrollView style={{ paddingHorizontal: 10 }}>
                <Switch />
                <View style={{ marginTop: 20, gap: 20 }}>
                  <Menu>
                    <MenuItem icon="person-outline" title="My Profile" />
                    <MenuItem
                      icon="notifications-outline"
                      title="Notifications"
                    />
                    <MenuItem icon="pie-chart-outline" title="Creator Studio" />
                    <MenuItem icon="bookmark-outline" title="Bookmarks" />
                    <MenuItem icon="cog-outline" title="Settings" />
                  </Menu>
                  <Menu>
                    <MenuItem
                      icon="log-out-outline"
                      title="Sign out"
                      onPress={() => logout()}
                    />
                  </Menu>
                </View>
              </ScrollView>
              <AppInfo />
            </Sheet>
          </>
        ) : (
          <SignIn />
        )}
      </View>
    </View>
  )
}

export default Header
