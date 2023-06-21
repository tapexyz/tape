import type { StatusBarProps } from 'expo-status-bar'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import React from 'react'

export const StatusBar = (props: StatusBarProps): JSX.Element => {
  return (
    <ExpoStatusBar
      animated
      hideTransitionAnimation="fade"
      translucent
      style="light"
      {...props}
    />
  )
}
