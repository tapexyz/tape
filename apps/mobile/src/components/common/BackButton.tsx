import Ionicons from '@expo/vector-icons/Ionicons'
import type { HeaderBackButtonProps } from '@react-navigation/elements'
import { MotiPressable } from 'moti/interactions'
import React, { useMemo } from 'react'

import haptic from '~/helpers/haptic'
import { theme } from '~/helpers/theme'

const BackButton = ({ onPress }: HeaderBackButtonProps) => {
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
    <MotiPressable
      style={{ paddingHorizontal: 5 }}
      onPress={() => {
        haptic()
        onPress?.()
      }}
      animate={animatePress}
    >
      <Ionicons
        name="chevron-back-outline"
        color={theme.colors.white}
        size={25}
      />
    </MotiPressable>
  )
}

export default BackButton
