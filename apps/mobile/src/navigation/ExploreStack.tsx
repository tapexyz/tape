import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/Header'
import { ExploreScreen } from '../screens/ExploreScreen'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTransparent: true,
          headerTitle: (props) => <Header {...props} />
        }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
