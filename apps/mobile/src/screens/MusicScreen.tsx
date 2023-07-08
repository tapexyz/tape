import React from 'react'
import { View } from 'react-native'

import List from '~/components/explore/music/List'

export const MusicScreen = (props: MusicScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  return (
    <View style={{ flex: 1, margin: 5, paddingVertical: 10 }}>
      <List />
    </View>
  )
}
