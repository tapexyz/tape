import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(14),
      color: themeConfig.textColor
    }
  })

const NextButton = () => {
  const { goBack } = useNavigation()
  const { themeConfig } = useMobileTheme()

  return (
    <AnimatedPressable
      style={{ paddingHorizontal: 15 }}
      onPress={() => {
        haptic()
        goBack()
      }}
    >
      <Text style={styles(themeConfig).text}>Next</Text>
    </AnimatedPressable>
  )
}

export default NextButton
