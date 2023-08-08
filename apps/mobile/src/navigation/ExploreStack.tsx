import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ExploreScreen } from '~/screens'

import Header from '../components/common/Header'
import useMobileStore from '../store'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

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
          headerStyle: {
            backgroundColor: `${homeGradientColor}35`,
            shadowColor: 'transparent', // this hide header shadow - iOS
            elevation: 0 // this hide header shadow - Android
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
