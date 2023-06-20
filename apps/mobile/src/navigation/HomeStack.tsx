import type { HeaderTitleProps } from '@react-navigation/elements'
import { createStackNavigator } from '@react-navigation/stack'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Text, View } from 'react-native'

import { DetailsScreen, HomeScreen } from '../screens'

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>()

function LogoTitle(props: HeaderTitleProps) {
  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      <Text>For you</Text>
      <ExpoImage
        source="https://picsum.photos/seed/696/3000/2000"
        contentFit="cover"
        style={{ width: 25, height: 25, borderRadius: 5 }}
      />
    </View>
  )
}

export const HomeStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTransparent: true
        }}
        component={HomeScreen}
      />
      <Screen
        name="Details"
        options={{ title: 'Details' }}
        component={DetailsScreen}
      />
    </Navigator>
  )
}
