import {
  createStackNavigator,
  type StackNavigationOptions
} from '@react-navigation/stack'
import type { FC } from 'react'
import React from 'react'
import { Easing } from 'react-native'

import CollapseButton from '~/components/common/header/CollapseButton'
import {
  CategoriesModal,
  FeedFlexModal,
  ManagersModal,
  MusicModal,
  NotificationsModal,
  PodcastModal,
  TopsModal
} from '~/components/common/modals'
import { useMobileTheme, useNetWorkConnection } from '~/hooks'
import { ProfileScreen, SettingsScreen, WatchScreen } from '~/screens'
import { NewPublication } from '~/screens/NewPublication'

import { BottomTabNavigator } from './BottomTabNavigator'

const { Navigator, Screen } = createStackNavigator<RootStackParamList>()

const options: StackNavigationOptions = {
  gestureEnabled: false,
  headerBackTitleVisible: false,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 400,
        easing: Easing.inOut(Easing.ease)
      }
    }
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress
      }
    }
  }
}

export const RootNavigator: FC = () => {
  useNetWorkConnection()

  const { themeConfig } = useMobileTheme()
  const modalOptions = {
    headerShown: true,
    headerTitleStyle: { fontFamily: 'font-medium', letterSpacing: 1 },
    headerStyle: {
      backgroundColor: themeConfig.backgroudColor
    },
    headerLeft: () => <CollapseButton />
  }

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="MainTab" options={options} component={BottomTabNavigator} />
      <Screen name="WatchScreen" options={options} component={WatchScreen} />
      <Screen
        name="NewPublication"
        options={options}
        component={NewPublication}
      />
      <Screen
        name="SettingsScreen"
        options={options}
        component={SettingsScreen}
      />

      <Screen
        name="ExploreTopsModal"
        options={{ ...options, presentation: 'transparentModal' }}
        component={TopsModal}
      />
      <Screen
        name="ExploreCategoriesModal"
        options={{ ...options, presentation: 'transparentModal' }}
        component={CategoriesModal}
      />
      <Screen
        name="FeedFlexModal"
        options={{ ...options, presentation: 'transparentModal' }}
        component={FeedFlexModal}
      />
      <Screen
        name="ProfileScreen"
        options={{ ...options, presentation: 'transparentModal' }}
        component={ProfileScreen}
      />

      <Screen
        name="MusicModal"
        options={{ presentation: 'modal' }}
        component={MusicModal}
      />
      <Screen
        name="PodcastModal"
        options={{
          ...modalOptions,
          title: 'Podcasts',
          presentation: 'modal'
        }}
        component={PodcastModal}
      />
      <Screen
        name="NotificationsModal"
        options={{
          ...modalOptions,
          presentation: 'modal',
          title: 'Notifications'
        }}
        component={NotificationsModal}
      />
      <Screen
        name="ManagersModal"
        options={{
          ...modalOptions,
          presentation: 'modal',
          title: 'Manage Profiles'
        }}
        component={ManagersModal}
      />
    </Navigator>
  )
}
