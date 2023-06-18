import type { StatusBarProps } from 'expo-status-bar'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import React from 'react'
import { useColorScheme } from 'react-native'

export const StatusBar = (props: StatusBarProps): JSX.Element => {
  const colorScheme = useColorScheme()

  return (
    <ExpoStatusBar
      animated
      hideTransitionAnimation="fade"
      style={colorScheme === 'dark' ? 'light' : 'dark'}
      {...props}
    />
  )
}
