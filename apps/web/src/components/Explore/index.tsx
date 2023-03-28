import MetaTags from '@components/Common/MetaTags'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import Trending from './Trending'

const Explore = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <>
      <MetaTags title="Explore" />
      <Trending />
    </>
  )
}

export default Explore
