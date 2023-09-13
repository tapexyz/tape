import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { useNavigation } from '@react-navigation/native'
import { useWalletConnectModal } from '@walletconnect/modal-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import haptic from '~/helpers/haptic'
import { signOut, useMobilePersistStore } from '~/store/persist'

import Menu from '../../profile/Menu'
import MenuItem from '../../profile/MenuItem'
import SwitchProfile from '../../profile/SwitchProfile'
import Sheet from '../../ui/Sheet'
import AppInfo from '../AppInfo'

const styles = StyleSheet.create({
  sheetContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    padding: 10
  }
})

const MenuSheet = ({
  profileMenuRef
}: {
  profileMenuRef: React.RefObject<BottomSheetModalMethods>
}) => {
  const { navigate } = useNavigation()
  const { provider } = useWalletConnectModal()

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )
  const setSelectedProfile = useMobilePersistStore(
    (state) => state.setSelectedProfile
  )

  const logout = () => {
    signOut()
    provider?.disconnect()
    setSelectedProfile(null)
    haptic()
  }

  if (!selectedProfile) {
    return null
  }

  return (
    <Sheet sheetRef={profileMenuRef}>
      <View style={styles.sheetContainer}>
        <View>
          <SwitchProfile />
          <View style={{ marginVertical: 10, gap: 10 }}>
            <Menu>
              <MenuItem
                icon="person-outline"
                title="My Profile"
                onPress={() => {
                  profileMenuRef.current?.close()
                  navigate('ProfileScreen', {
                    handle: selectedProfile.handle
                  })
                }}
              />
              <MenuItem
                icon="notifications-outline"
                title="Notifications"
                onPress={() => {
                  profileMenuRef.current?.close()
                  navigate('NotificationsModal')
                }}
              />
              <MenuItem icon="bookmark-outline" title="Bookmarks" />
            </Menu>
            <Menu>
              <MenuItem icon="pie-chart-outline" title="Creator Studio" />
              <MenuItem
                icon="people-outline"
                title="Managers"
                onPress={() => {
                  profileMenuRef.current?.close()
                  navigate('ManagersModal')
                }}
              />
              <MenuItem
                icon="cog-outline"
                title="Settings"
                onPress={() => {
                  profileMenuRef.current?.close()
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
  )
}

export default MenuSheet
