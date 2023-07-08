import { useScrollToTop } from '@react-navigation/native'
import React, { useRef } from 'react'
import type { ScrollView } from 'react-native'

import Timeline from '~/components/explore/Timeline'

import Container from '../components/common/Container'

export const ExploreScreen = (props: ExploreScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  return (
    <Container>
      <Timeline />
    </Container>
  )
}
