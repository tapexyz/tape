import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ExploreScreen } from '~/screens'

import Header from '../components/common/header/Header'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  return (
    <Navigator
      screenOptions={{
        animationEnabled: true,
        headerShadowVisible: false
      }}
    >
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTitle: (props) => <Header {...props} />,
          headerTransparent: true,
          headerStyle: {
            shadowColor: 'transparent', // this hide header shadow - iOS
            elevation: 0 // this hide header shadow - Android
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
