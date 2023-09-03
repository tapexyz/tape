import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import ActionHeader from '~/components/settings/ActionHeader'
import Appearance from '~/components/settings/Appearance'
import Accordion from '~/components/ui/Accordion'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

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
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <SafeAreaView style={style.container}>
      <ActionHeader onSave={() => {}} />
      <Accordion setActive={() => {}} />
      <Appearance />
    </SafeAreaView>
  )
}
