import Ionicons from '@expo/vector-icons/Ionicons'
import type { HeaderBackButtonProps } from '@react-navigation/elements'
import React from 'react'

import haptic from '~/helpers/haptic'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const BackButton = ({ onPress }: HeaderBackButtonProps) => {
  return (
    <AnimatedPressable
      style={{ paddingHorizontal: 5 }}
      onPress={() => {
        haptic()
        onPress?.()
      }}
    >
      <Ionicons
        name="chevron-back-outline"
        color={theme.colors.white}
        size={25}
      />
    </AnimatedPressable>
  )
}

export default BackButton
