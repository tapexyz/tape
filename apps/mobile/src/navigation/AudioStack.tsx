import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { AudioScreen } from '../screens/AudioScreen'

const { Navigator, Screen } = createStackNavigator<AudioStackParamList>()

export const AudioStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Audio"
        options={{ title: 'Audio' }}
        component={AudioScreen}
      />
    </Navigator>
  )
}
