import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MotiView } from 'moti'
import type { FC } from 'react'
import React, { useCallback } from 'react'

import { useNavigationTheme } from '../hooks/navigation/useNavigationTheme'
import { CommunityStack } from './CommunityStack'
import { HomeStack } from './HomeStack'
import { MediaStack } from './MediaStack'

const { Navigator, Screen } = createBottomTabNavigator<MainTabParamList>()

type ScreenOptions = (
  params: BottomTabScreenProps
) => BottomTabNavigationOptions

export const BottomTabNavigator: FC = () => {
  const { tabBarTheme } = useNavigationTheme()

  const screenOptions = useCallback<ScreenOptions>(
    ({ route }) => ({
      tabBarShowLabel: false,
      tabBarIcon: ({ color, size }: { color: string; size: number }) => {
        let iconName: keyof typeof Ionicons.glyphMap

        if (route.name === 'CommunityStack') {
          iconName = 'leaf-outline'
        } else if (route.name === 'HomeStack') {
          iconName = 'bonfire-outline'
        } else if (route.name === 'MediaStack') {
          iconName = 'headset-outline'
        } else {
          iconName = 'globe'
        }

        return (
          <MotiView
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              type: 'spring',
              delay: 50
            }}
            from={{ opacity: 0 }}
          >
            <Ionicons name={iconName} size={size} color={color} />
          </MotiView>
        )
      },
      headerShown: false,
      ...tabBarTheme
    }),
    [tabBarTheme]
  )

  return (
    <Navigator screenOptions={screenOptions} initialRouteName="HomeStack">
      <Screen
        name="CommunityStack"
        options={{ title: 'Community' }}
        component={CommunityStack}
      />
      <Screen
        name="HomeStack"
        options={{ title: 'Home' }}
        component={HomeStack}
      />
      <Screen
        name="MediaStack"
        options={{ title: 'Media' }}
        component={MediaStack}
      />
    </Navigator>
  )
}
