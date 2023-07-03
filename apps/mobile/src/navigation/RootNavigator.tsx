import { createStackNavigator } from '@react-navigation/stack'
import type { FC } from 'react'
import React from 'react'
import { useWindowDimensions } from 'react-native'

import WatchVideoModal from '~/components/common/modals/WatchVideoModal'

import CategoriesModal from '../components/common/modals/CategoriesModal'
import TopsModal from '../components/common/modals/TopsModal'
import SignInScreen from '../screens/SignInScreen'
import { BottomTabNavigator } from './BottomTabNavigator'

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>()

export const RootNavigator: FC = () => {
  const isSignedIn = true
  const { height } = useWindowDimensions()

  return (
    <Navigator>
      {!isSignedIn ? (
        <Group key="unauthorized">
          <Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'navigation.screen_titles.sign_in'
            }}
          />
        </Group>
      ) : (
        <Group key="authorized">
          <Screen
            name="MainTab"
            options={{
              headerShown: false
            }}
            component={BottomTabNavigator}
          />
          {/* <Screen
            name="Settings"
            options={{ title: 'navigation.screen_titles.settings' }}
            component={SettingsScreen}
          /> */}
        </Group>
      )}
      <Group key="modals" screenOptions={{ presentation: 'modal' }}>
        <Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: 'sign_in'
          }}
        />
        <Screen
          name="ExploreTopsModal"
          component={TopsModal}
          options={{ headerShown: false, presentation: 'transparentModal' }}
        />
        <Screen
          name="ExploreCategoriesModal"
          component={CategoriesModal}
          options={{ headerShown: false, presentation: 'transparentModal' }}
        />
        <Screen
          name="WatchVideo"
          component={WatchVideoModal}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            gestureResponseDistance: height / 3.5
          }}
        />
      </Group>
    </Navigator>
  )
}
