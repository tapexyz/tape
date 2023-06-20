import { LinearGradient } from 'expo-linear-gradient'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { theme } from '../constants/theme'

const styles = StyleSheet.create({
  background: {
    flex: 1
  }
})

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LinearGradient
      colors={[theme.colors.gradient.from, theme.colors.gradient.to]}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  )
}

export default Container
