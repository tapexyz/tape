import { useScrollToTop } from '@react-navigation/native'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native'

import Container from '~/components/common/Container'
import Timeline from '~/components/common/Timeline'
import ByteCards from '~/components/home/ByteCards'
import FirstSteps from '~/components/home/FirstSteps'
import PopularCreators from '~/components/home/PopularCreators'
import TimelineFilters from '~/components/home/TimelineFilters'

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  return (
    <Container>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <ByteCards />
        <FirstSteps />
        <PopularCreators />
        <TimelineFilters />
        <Timeline />
      </ScrollView>
    </Container>
  )
}
