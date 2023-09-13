import Ionicons from '@expo/vector-icons/Ionicons'
import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { HeaderTitleProps } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import AnimatedPressable from '../../ui/AnimatedPressable'
import SignIn from '../auth/SignIn'
import UserProfile from '../UserProfile'
import MenuSheet from './MenuSheet'

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
    }
  })

const AuthenticatedUser = () => {
  const profileMenuRef = useRef<BottomSheetModal>(null)
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  if (!selectedProfile) {
    return null
  }

  return (
    <>
      <UserProfile
        profile={selectedProfile}
        showHandle={false}
        size={30}
        onPress={() => {
          haptic()
          profileMenuRef.current?.present()
        }}
      />
      <MenuSheet profileMenuRef={profileMenuRef} />
    </>
  )
}

const Header: FC<HeaderTitleProps> = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const { navigate } = useNavigation()

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  return (
    <View style={style.container}>
      <Text style={style.forYouText}>gm</Text>

      <View style={style.rightView}>
        {selectedProfile && (
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

        {selectedProfile ? <AuthenticatedUser /> : <SignIn />}
      </View>
    </View>
  )
}

export default Header
