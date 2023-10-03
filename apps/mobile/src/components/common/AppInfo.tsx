import { LENSTUBE_APP_NAME } from '@lenstube/constants'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import Constants from 'expo-constants'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    otherInfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      padding: 5,
      opacity: 0.8
    },
    otherInfo: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

const AppInfo = () => {
  const version = Constants.expoConfig?.version
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.otherInfoContainer}>
      <Text style={style.otherInfo}>{LENSTUBE_APP_NAME}</Text>
      <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
        {'\u2B24'}
      </Text>
      <Text style={style.otherInfo}>{version}</Text>
    </View>
  )
}

export default AppInfo
