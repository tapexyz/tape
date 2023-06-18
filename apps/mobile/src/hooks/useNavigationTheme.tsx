import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { Theme } from '@react-navigation/native'
import { useMemo } from 'react'
import { useColorScheme } from 'react-native'

export const lightNavigationTheme: Theme = {
  colors: {
    background: 'white',
    border: 'white',
    card: 'white',
    notification: 'red',
    primary: 'white',
    text: 'black'
  },
  dark: false
}

export const darkNavigationTheme: Theme = {
  colors: {
    background: 'black',
    border: 'black',
    card: 'black',
    notification: 'red',
    primary: 'black',
    text: 'white'
  },
  dark: true
}

type ReturnValues = {
  navigationTheme: Theme
  tabBarTheme: BottomTabNavigationOptions
}

export const useNavigationTheme = (): ReturnValues => {
  const colorScheme = useColorScheme()

  const tabBarTheme: BottomTabNavigationOptions = useMemo(
    () => ({
      tabBarActiveTintColor: 'red',
      tabBarInactiveTintColor: 'blue'
    }),
    []
  )

  const navigationTheme =
    colorScheme === 'dark' ? darkNavigationTheme : lightNavigationTheme

  return {
    navigationTheme,
    tabBarTheme
  }
}
