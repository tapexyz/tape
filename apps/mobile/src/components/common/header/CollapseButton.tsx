import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import haptic from '~/helpers/haptic'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../../ui/AnimatedPressable'

const CollapseButton = () => {
  const { themeConfig } = useMobileTheme()
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
        color={themeConfig.textColor}
        size={25}
      />
    </AnimatedPressable>
  )
}

export default CollapseButton
