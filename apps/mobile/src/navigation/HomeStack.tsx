import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/common/Header'
import { theme } from '../constants/theme'
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
          // headerTransparent: true,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            backgroundColor: theme.colors.gradient.from,
            // hide header shadow
            shadowColor: 'transparent', // this covers iOS
            elevation: 0 // this covers Android
          }
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
