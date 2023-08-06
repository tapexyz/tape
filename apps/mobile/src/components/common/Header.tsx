import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'

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
    paddingBottom: 10
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
    fontSize: normalizeFont(22)
  }
})

const AuthenticatedUser = () => {
  const profileSheetRef = useRef<BottomSheetModal>(null)
  const { navigate } = useNavigation()
  const { provider } = useWalletConnectModal()

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
      <SharedElement id={`profile.${selectedChannel.handle}`}>
        <UserProfile
          profile={selectedChannel}
          showHandle={false}
          size={30}
          radius={10}
          onPress={() => profileSheetRef.current?.present()}
        />
      </SharedElement>
      <Sheet sheetRef={profileSheetRef} snap={['60%']}>
        <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Switch />
          <View style={{ marginTop: 15, gap: 15 }}>
            <Menu>
              <MenuItem
                icon="person-outline"
                title="My Profile"
                onPress={() => {
                  profileSheetRef.current?.close()
                  navigate('ProfileModal', {
                    handle: selectedChannel.handle
                  })
                }}
              />
              <MenuItem icon="notifications-outline" title="Notifications" />
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
  )
}

const Header: FC<HeaderTitleProps> = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

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
              size={22}
            />
          </AnimatedPressable>
        )}

        {selectedChannel ? <AuthenticatedUser /> : <SignIn />}
      </View>
    </View>
  )
}

export default Header
