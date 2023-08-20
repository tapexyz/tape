import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import { useToast } from '../common/toast'
import AnimatedPressable from './AnimatedPressable'

const styles = StyleSheet.create({
  text: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const ServerError = () => {
  const { showToast } = useToast()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AnimatedPressable
        style={{ gap: 10, alignItems: 'center' }}
        onPress={() => {
          showToast({ text: 'Restart the app to try again', variant: 'warn' })
        }}
      >
        <Text style={{ fontSize: normalizeFont(30) }}>🧑🏻‍🚒</Text>
        <Text style={styles.text}>Failed to fetch</Text>
      </AnimatedPressable>
    </View>
  )
}

export default ServerError
