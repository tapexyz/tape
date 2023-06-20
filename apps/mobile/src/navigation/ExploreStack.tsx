import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/Header'
import { theme } from '../constants/theme'
import { ExploreScreen } from '../screens/ExploreScreen'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTitle: (props) => <Header {...props} />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.gradient.to
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
