import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { VideoScreen } from '../screens/VideoScreen'

const { Navigator, Screen } = createStackNavigator<VideoStackParamList>()

export const VideoStack = (): JSX.Element => {
  return (
    <Navigator>
      <Screen
        name="Video"
        options={{ title: 'Video' }}
        component={VideoScreen}
      />
    </Navigator>
  )
}
