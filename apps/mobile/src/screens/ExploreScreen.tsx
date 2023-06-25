import React from 'react'
import { ScrollView } from 'react-native'

import Container from '../components/common/Container'
import Timeline from '../components/common/Timeline'
import Filters from '../components/explore/Filters'
import Showcase from '../components/explore/Showcase'

export const ExploreScreen = (props: ExploreScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Showcase />
        <Filters />
        <Timeline />
      </ScrollView>
    </Container>
  )
}
