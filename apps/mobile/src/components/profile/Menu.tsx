import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backdrop2,
    borderRadius: 20
  }
})

const Menu: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Animated.View entering={FadeIn.delay(200)} style={styles.card}>
      <View>{children}</View>
    </Animated.View>
  )
}

export default Menu
