import MetaTags from '@components/Common/MetaTags'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import Recommended from './Recommended'
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
      <Recommended />
    </>
  )
}

export default Explore
