import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { CommunityScreen } from '../screens/CommunityScreen'

const { Navigator, Screen } = createStackNavigator<CommunityStackParamList>()

export const CommunityStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Community"
        options={{ title: 'Community' }}
        component={CommunityScreen}
      />
    </Navigator>
  )
}
