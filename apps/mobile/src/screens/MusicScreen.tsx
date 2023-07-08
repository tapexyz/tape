import React from 'react'

import List from '~/components/explore/music/List'

export const MusicScreen = (props: MusicScreenProps): JSX.Element => {
  const {
    route: {}
  } = props

  return <List />
}
