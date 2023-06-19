import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { MediaScreen } from '../screens/MediaScreen'

const { Navigator, Screen } = createStackNavigator<MediaStackParamList>()

export const MediaStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Media"
        options={{ title: 'Media' }}
        component={MediaScreen}
      />
    </Navigator>
  )
}
