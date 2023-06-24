import React from 'react'
import { ScrollView } from 'react-native'

import Container from '../components/common/Container'
import Timeline from '../components/common/Timeline'
import Filters from '../components/explore/Filters'

export const ExploreScreen = (props: ExploreScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Filters />
        <Timeline />
      </ScrollView>
    </Container>
  )
}
