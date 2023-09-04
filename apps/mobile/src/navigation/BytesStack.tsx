import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { BytesScreen } from '~/screens'

const { Navigator, Screen } = createStackNavigator<BytesStackParamList>()

export const BytesStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Bytes"
        options={{
          title: 'Bytes',
          headerShown: false
        }}
        component={BytesScreen}
      />
    </Navigator>
  )
}
