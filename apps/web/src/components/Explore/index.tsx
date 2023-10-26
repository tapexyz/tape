import MetaTags from '@components/Common/MetaTags'
import { EVENTS, Tower } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import ExploreFeed from './Feed'

const Explore = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <MetaTags title="Explore" />
      <ExploreFeed />
    </div>
  )
}

export default Explore
