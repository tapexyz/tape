import React from 'react'
import { View } from 'react-native'

import Stage from '~/components/explore/music/Stage'
import { theme } from '~/helpers/theme'

export const MusicModal = (): JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.black
      }}
    >
      <Stage />
    </View>
  )
}
