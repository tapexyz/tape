import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/Header'
import { DetailsScreen, HomeScreen } from '../screens'

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>()

export const HomeStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: (props) => <Header {...props} />,
          headerTransparent: true
        }}
        component={HomeScreen}
      />
      <Screen
        name="Details"
        options={{ title: 'Details' }}
        component={DetailsScreen}
      />
    </Navigator>
  )
}
