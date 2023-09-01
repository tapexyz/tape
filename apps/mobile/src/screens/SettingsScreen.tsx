import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import ActionHeader from '~/components/settings/ActionHeader'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme, useSafeAreaInsets } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: themeConfig.backgroudColor
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.secondaryTextColor
    }
  })

export const SettingsScreen = () => {
  const { top } = useSafeAreaInsets()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={[style.container, { top }]}>
      <ActionHeader onSave={() => {}} />
    </View>
  )
}
