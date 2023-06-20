import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { BytesScreen } from '../screens/BytesScreen'

const { Navigator, Screen } = createStackNavigator<BytesStackParamList>()

export const BytesStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Bytes"
        options={{ title: 'Bytes' }}
        component={BytesScreen}
      />
    </Navigator>
  )
}
