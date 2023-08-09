import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(14),
    color: theme.colors.white
  }
})

const NextButton = () => {
  const { goBack } = useNavigation()

  return (
    <AnimatedPressable
      style={{ paddingHorizontal: 15 }}
      onPress={() => {
        haptic()
        goBack()
      }}
    >
      <Text style={styles.text}>Next</Text>
    </AnimatedPressable>
  )
}

export default NextButton
