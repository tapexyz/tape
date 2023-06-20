import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ExploreScreen } from '../screens/ExploreScreen'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{ title: 'Explore' }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
