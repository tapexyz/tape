import Ionicons from '@expo/vector-icons/Ionicons'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import haptic from '~/helpers/haptic'
import { windowWidth } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    actionIcon: {
      backgroundColor: themeConfig.backgroudColor2,
      borderRadius: 100,
      width: windowWidth * 0.1,
      height: windowWidth * 0.1,
      alignItems: 'center',
      paddingTop: 1,
      justifyContent: 'center',
      marginBottom: 10
    }
  })

const ActionHeader = ({ onSave }: { onSave: () => void }) => {
  const { goBack } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <AnimatedPressable onPress={() => goBack()} style={style.actionIcon}>
        <Ionicons
          name="close-outline"
          color={themeConfig.textColor}
          size={32}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => {
          onSave()
          haptic()
        }}
        style={style.actionIcon}
      >
        <Ionicons
          name="checkmark-outline"
          color={themeConfig.textColor}
          size={22}
        />
      </AnimatedPressable>
    </View>
  )
}

export default ActionHeader
