import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { HomeScreen } from '~/screens'

import Header from '../components/common/header/Header'

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>()

export const HomeStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: (props) => <Header {...props} />,
          headerTransparent: true,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            // hide header shadow
            shadowColor: 'transparent', // this covers iOS
            elevation: 0 // this covers Android
            // backgroundColor: `${homeGradientColor}35`
          }
        }}
        component={HomeScreen}
      />
    </Navigator>
  )
}
