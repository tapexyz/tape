import React from 'react'

import Container from '~/components/common/Container'
import Stage from '~/components/explore/music/Stage'

export const MusicScreen = (props: MusicScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  return (
    <Container>
      <Stage />
    </Container>
  )
}
