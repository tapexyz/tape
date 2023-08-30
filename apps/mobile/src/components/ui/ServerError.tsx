import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import { useToast } from '../common/toast'
import AnimatedPressable from './AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    text: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const ServerError = () => {
  const { showToast } = useToast()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AnimatedPressable
        style={{ gap: 10, alignItems: 'center' }}
        onPress={() => {
          showToast({ text: 'Restart the app to try again', variant: 'warn' })
        }}
      >
        <Text style={{ fontSize: normalizeFont(30) }}>🧑🏻‍🚒</Text>
        <Text style={style.text}>Failed to fetch</Text>
      </AnimatedPressable>
    </View>
  )
}

export default ServerError
