import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import BackButton from '~/components/common/BackButton'
import { theme } from '~/helpers/theme'
import { MusicScreen } from '~/screens/MusicScreen'

import Header from '../components/common/Header'
import { ExploreScreen } from '../screens/ExploreScreen'
import useMobileStore from '../store'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTitle: (props) => <Header {...props} />,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            backgroundColor: `${homeGradientColor}35`,
            // hide header shadow
            shadowColor: 'transparent', // this covers iOS
            elevation: 0 // this covers Android
          }
        }}
        component={ExploreScreen}
      />
      <Screen
        name="Music"
        options={{
          headerShadowVisible: false,
          animationEnabled: true,
          headerLeft: (props) => <BackButton {...props} />,
          headerTitleStyle: { fontFamily: 'font-medium', letterSpacing: 1 },
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: 'transparent',
            elevation: 0
          }
        }}
        component={MusicScreen}
      />
    </Navigator>
  )
}
