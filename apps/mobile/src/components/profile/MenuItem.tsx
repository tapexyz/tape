import Ionicons from '@expo/vector-icons/Ionicons'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
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
    color: theme.colors.white
  }
})

type Props = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress?: () => void
  showArrow?: boolean
}

const MenuItem: FC<Props> = ({ icon, title, showArrow = true, onPress }) => {
  return (
    <AnimatedPressable style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons
          name={icon}
          style={{ opacity: 0.7 }}
          color={theme.colors.white}
          size={17}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          color={theme.colors.white}
          style={{ opacity: 0.6 }}
          size={20}
        />
      )}
    </AnimatedPressable>
  )
}

export default MenuItem
