import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { Theme } from '@react-navigation/native'
import { useMemo } from 'react'

import { isLightMode } from '~/store/persist'

import { useMobileTheme } from '../useMobileTheme'

type ReturnValues = {
  navigationTheme: Theme
  tabBarTheme: BottomTabNavigationOptions
}

export const useNavigationTheme = (): ReturnValues => {
  const { themeConfig } = useMobileTheme()

  const navigationTheme: Theme = {
    colors: {
      background: themeConfig.backgroudColor,
      border: themeConfig.backgroudColor,
      card: themeConfig.backgroudColor2,
      notification: 'red',
      primary: themeConfig.textColor,
      text: themeConfig.textColor
    },
    dark: !isLightMode()
  }

  const tabBarTheme: BottomTabNavigationOptions = useMemo(
    () => ({
      tabBarActiveTintColor: themeConfig.textColor,
      tabBarInactiveTintColor: themeConfig.secondaryTextColor
    }),
    [themeConfig]
  )

  return {
    navigationTheme,
    tabBarTheme
  }
}
