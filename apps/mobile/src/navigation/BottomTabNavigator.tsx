import { Feather } from '@expo/vector-icons'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { FC } from 'react'
import React, { useCallback } from 'react'

import { useNavigationTheme } from '../hooks/useNavigationTheme'
import { HomeStack } from './HomeStack'

const { Navigator, Screen } = createBottomTabNavigator<MainTabParamList>()

type ScreenOptions = (
  params: BottomTabScreenProps
) => BottomTabNavigationOptions

export const BottomTabNavigator: FC = () => {
  const { tabBarTheme } = useNavigationTheme()

  const screenOptions = useCallback<ScreenOptions>(
    ({ route }: any) => ({
      tabBarIcon: ({ color, size }: { color: string; size: number }) => {
        let iconName: keyof typeof Feather.glyphMap

        if (route.name === 'HomeStack') {
          iconName = 'home'
        } else if (route.name === 'ExamplesStack') {
          iconName = 'list'
        } else {
          iconName = 'alert-triangle'
        }

        // You can return any component that you like here!
        return <Feather name={iconName} size={size} color={color} />
      },
      headerShown: false,
      ...tabBarTheme
    }),
    [tabBarTheme]
  )

  return (
    <Navigator screenOptions={screenOptions}>
      <Screen
        name="HomeStack"
        options={{ title: 'navigation.screen_titles.home_stack' }}
        component={HomeStack}
      />
      {/* <Screen
        name="ExamplesStack"
        options={{ title: t('navigation.screen_titles.examples_stack') }}
        component={ExamplesStack}
      /> */}
    </Navigator>
  )
}
