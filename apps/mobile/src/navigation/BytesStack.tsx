import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/Header'
import { BytesScreen } from '../screens/BytesScreen'

const { Navigator, Screen } = createStackNavigator<BytesStackParamList>()

export const BytesStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Bytes"
        options={{
          title: 'Bytes',
          headerTransparent: true,
          headerTitle: (props) => <Header {...props} />
        }}
        component={BytesScreen}
      />
    </Navigator>
  )
}
