import React from 'react'
import Animated, { FadeInRight } from 'react-native-reanimated'

import FeedFilters from './FeedFilters'

const Feed = () => {
  return (
    <Animated.View entering={FadeInRight.delay(200).duration(400)}>
      <FeedFilters />
    </Animated.View>
  )
}

export default Feed
