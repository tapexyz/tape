import Ionicons from '@expo/vector-icons/Ionicons'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14
    },
    title: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(14),
      color: themeConfig.textColor
    }
  })

type Props = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress?: () => void
  showArrow?: boolean
}

const MenuItem: FC<Props> = ({ icon, title, showArrow = true, onPress }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <AnimatedPressable style={style.item} onPress={onPress}>
      <View style={style.left}>
        <Ionicons
          name={icon}
          style={{ opacity: 0.7 }}
          color={themeConfig.textColor}
          size={17}
        />
        <Text style={style.title}>{title}</Text>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          color={themeConfig.textColor}
          style={{ opacity: 0.6 }}
          size={20}
        />
      )}
    </AnimatedPressable>
  )
}

export default MenuItem
