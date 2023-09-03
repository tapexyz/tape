import Ionicons from '@expo/vector-icons/Ionicons'
import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobileStore from '~/store'
import { signOut } from '~/store/persist'

import Menu from '../profile/Menu'
import MenuItem from '../profile/MenuItem'
import SwitchProfile from '../profile/SwitchProfile'
import AnimatedPressable from '../ui/AnimatedPressable'
import Sheet from '../ui/Sheet'
import AppInfo from './AppInfo'
import SignInWithQR from './auth/SignInWithQR'
import UserProfile from './UserProfile'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10
    },
    rightView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20
    },
    forYouText: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontWeight: '500',
      fontSize: normalizeFont(22)
    },
    newButton: {
      width: 30,
      height: 30,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeConfig.backgroudColor
    },
    sheetContainer: {
      justifyContent: 'space-between',
      flexDirection: 'column',
      flex: 1,
      padding: 10
    }
  })

const AuthenticatedUser = () => {
  const profileSheetRef = useRef<BottomSheetModal>(null)
  const { navigate } = useNavigation()
  const { provider } = useWalletConnectModal()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const logout = () => {
    signOut()
    provider?.disconnect()
    setSelectedChannel(null)
    haptic()
  }

  if (!selectedChannel) {
    return null
  }

  return (
    <>
      <UserProfile
        profile={selectedChannel}
        showHandle={false}
        size={30}
        onPress={() => {
          haptic()
          profileSheetRef.current?.present()
        }}
      />
      <Sheet sheetRef={profileSheetRef}>
        <View style={style.sheetContainer}>
          <View>
            <SwitchProfile />
            <View style={{ marginVertical: 10, gap: 10 }}>
              <Menu>
                <MenuItem
                  icon="person-outline"
                  title="My Profile"
                  onPress={() => {
                    profileSheetRef.current?.close()
                    navigate('ProfileScreen', {
                      handle: selectedChannel.handle
                    })
                  }}
                />
                <MenuItem
                  icon="notifications-outline"
                  title="Notifications"
                  onPress={() => {
                    profileSheetRef.current?.close()
                    navigate('NotificationsModal')
                  }}
                />
                <MenuItem icon="bookmark-outline" title="Bookmarks" />
              </Menu>
              <Menu>
                <MenuItem icon="pie-chart-outline" title="Creator Studio" />
                <MenuItem icon="people-outline" title="Manager" />
                <MenuItem
                  icon="cog-outline"
                  title="Settings"
                  onPress={() => {
                    profileSheetRef.current?.close()
                    navigate('SettingsScreen')
                  }}
                />
              </Menu>
              <Menu>
                <MenuItem
                  icon="log-out-outline"
                  title="Sign out"
                  onPress={() => logout()}
                  showArrow={false}
                />
              </Menu>
            </View>
          </View>
          <AppInfo />
        </View>
      </Sheet>
    </>
  )
}

const Header: FC<HeaderTitleProps> = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { navigate } = useNavigation()

  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  return (
    <View style={style.container}>
      <Text style={style.forYouText}>gm</Text>

      <View style={style.rightView}>
        {selectedChannel && (
          <AnimatedPressable
            style={style.newButton}
            onPress={() => navigate('NewPublication')}
          >
            <Ionicons
              name="add-outline"
              color={themeConfig.textColor}
              style={{ paddingLeft: 1 }}
              size={20}
            />
          </AnimatedPressable>
        )}

        {selectedChannel ? <AuthenticatedUser /> : <SignInWithQR />}
      </View>
    </View>
  )
}

export default Header
