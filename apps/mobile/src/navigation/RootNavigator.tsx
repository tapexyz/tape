import { createStackNavigator } from '@react-navigation/stack'
import type { FC } from 'react'
import React from 'react'

import CategoriesModal from '../components/explore/CategoriesModal'
import TopsModal from '../components/explore/TopsModal'
import SignInScreen from '../screens/SignInScreen'
import { BottomTabNavigator } from './BottomTabNavigator'

const { Navigator, Screen, Group } = createStackNavigator<RootStackParamList>()

export const RootNavigator: FC = () => {
  const isSignedIn = true

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
              title: 'main_tab',
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
      </Group>
    </Navigator>
  )
}
