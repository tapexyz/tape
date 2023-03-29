import MetaTags from '@components/Common/MetaTags'
import BytesShimmer from '@components/Shimmers/BytesShimmer'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'
const BytesSection = dynamic(() => import('./BytesSection'), {
  loading: () => <BytesShimmer />
})

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags title="Home" />
      <DispatcherAlert />
      <BytesSection />
      <HomeFeed />
    </>
  )
}

export default Home
