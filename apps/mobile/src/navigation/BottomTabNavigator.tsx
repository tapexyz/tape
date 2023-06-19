import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MotiView } from 'moti'
import type { FC } from 'react'
import React, { useCallback } from 'react'

import haptic from '../helpers/haptic'
import { useNavigationTheme } from '../hooks/navigation/useNavigationTheme'
import { AudioStack } from './AudioStack'
import { HomeStack } from './HomeStack'
import { VideoStack } from './VideoStack'

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

        if (route.name === 'VideoStack') {
          iconName = 'videocam-outline'
        } else if (route.name === 'HomeStack') {
          iconName = 'bonfire-outline'
        } else if (route.name === 'AudioStack') {
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
    <Navigator
      screenOptions={screenOptions}
      initialRouteName="HomeStack"
      screenListeners={{
        tabPress: () => haptic()
      }}
    >
      <Screen
        name="VideoStack"
        options={{ title: 'Video' }}
        component={VideoStack}
      />
      <Screen
        name="HomeStack"
        options={{ title: 'Home' }}
        component={HomeStack}
      />
      <Screen
        name="AudioStack"
        options={{ title: 'Audio' }}
        component={AudioStack}
      />
    </Navigator>
  )
}
