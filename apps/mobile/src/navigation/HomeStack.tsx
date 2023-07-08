import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { HomeScreen } from '~/screens'

import Header from '../components/common/Header'
import useMobileStore from '../store'

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>()

export const HomeStack = (): JSX.Element => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  return (
    <Navigator>
      <Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: (props) => <Header {...props} />,
          // headerTransparent: true,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            backgroundColor: `${homeGradientColor}35`,
            // hide header shadow
            shadowColor: 'transparent', // this covers iOS
            elevation: 0 // this covers Android
          }
        }}
        component={HomeScreen}
      />
    </Navigator>
  )
}
