import { useScrollToTop } from '@react-navigation/native'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'

import Container from '../components/common/Container'
import Timeline from '../components/common/Timeline'
import Filters from '../components/explore/Filters'
import Showcase from '../components/explore/Showcase'

export const ExploreScreen = (props: ExploreScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  return (
    <Container>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        <Showcase />
        <Filters />
        <Timeline />
      </ScrollView>
    </Container>
  )
}
