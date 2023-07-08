import React from 'react'

import Container from '~/components/common/Container'
import Timeline from '~/components/home/Timeline'

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: {}
  } = props

  return (
    <Container>
      <Timeline />
    </Container>
  )
}
