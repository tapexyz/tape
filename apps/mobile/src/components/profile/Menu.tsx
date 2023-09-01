import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    card: {
      backgroundColor: themeConfig.backgroudColor,
      borderRadius: 20
    }
  })

const Menu: FC<PropsWithChildren> = ({ children }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.card}>
      <View>{children}</View>
    </View>
  )
}

export default Menu
