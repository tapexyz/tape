import { type StackNavigationOptions } from '@react-navigation/stack'
import type { FC } from 'react'
import React from 'react'
import { Easing } from 'react-native'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

import CollapseButton from '~/components/common/CollapseButton'
import {
  CategoriesModal,
  MusicModal,
  NotificationsModal,
  PodcastModal,
  TopsModal
} from '~/components/common/modals'
import { theme } from '~/helpers/theme'
import { useNetWorkConnection } from '~/hooks'
import { ProfileScreen, WatchScreen } from '~/screens'
import { NewPublication } from '~/screens/NewPublication'

import { BottomTabNavigator } from './BottomTabNavigator'

const { Navigator, Screen } =
  createSharedElementStackNavigator<RootStackParamList>()

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

const modalOptions = {
  headerShown: true,
  headerTitleStyle: { fontFamily: 'font-medium', letterSpacing: 1 },
  headerStyle: {
    backgroundColor: theme.colors.background
  },
  headerLeft: () => <CollapseButton />
}

export const RootNavigator: FC = () => {
  useNetWorkConnection()

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="MainTab" options={options} component={BottomTabNavigator} />
      <Screen
        name="WatchVideo"
        options={options}
        component={WatchScreen}
        sharedElements={(route) => {
          const { id } = route.params
          if (id) {
            return [
              { id: `video.watch.${id}.thumbnail`, animation: 'fade' },
              { id: `video.watch.${id}.info`, animation: 'fade' }
            ]
          }
        }}
      />
      <Screen
        name="NewPublication"
        options={options}
        component={NewPublication}
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
        name="ProfileScreen"
        options={{ ...options, presentation: 'transparentModal' }}
        component={ProfileScreen}
        sharedElements={(route) => {
          const { handle } = route.params
          if (handle) {
            return [{ id: `profile.${handle}`, animation: 'fade' }]
          }
        }}
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
    </Navigator>
  )
}