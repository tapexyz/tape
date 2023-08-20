import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backdrop2,
    borderRadius: 20
  }
})

const Menu: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={styles.card}>
      <View>{children}</View>
    </View>
  )
}

export default Menu
