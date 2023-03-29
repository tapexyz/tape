import MetaTags from '@components/Common/MetaTags'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import Curated from './Curated'
import Trending from './Trending'

const Explore = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <>
      <MetaTags title="Explore" />
      <Trending />
      <hr className="border-theme my-6 border-opacity-10 dark:border-gray-700" />
      <Curated />
    </>
  )
}

export default Explore
