import React from 'react'
import { ScrollView } from 'react-native'

import IntroCard from '~/components/explore/music/IntroCard'
import List from '~/components/explore/music/List'
import MusicFilters from '~/components/explore/MusicFilters'

export const MusicScreen = (props: MusicScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  return (
    <ScrollView
      style={{ flex: 1, margin: 5, paddingVertical: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <IntroCard />
      <MusicFilters />
      <List />
    </ScrollView>
  )
}
