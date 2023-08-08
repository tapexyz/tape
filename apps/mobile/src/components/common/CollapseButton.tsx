import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import haptic from '~/helpers/haptic'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const CollapseButton = () => {
  const { goBack } = useNavigation()

  return (
    <AnimatedPressable
      style={{ paddingHorizontal: 10 }}
      onPress={() => {
        haptic()
        goBack()
      }}
    >
      <Ionicons
        name="chevron-down-outline"
        color={theme.colors.white}
        size={25}
      />
    </AnimatedPressable>
  )
}

export default CollapseButton
