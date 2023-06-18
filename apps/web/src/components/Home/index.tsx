import MetaTags from '@components/Common/MetaTags'
import BytesShimmer from '@components/Shimmers/BytesShimmer'
import { t } from '@lingui/macro'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'
import Banner from './Banner'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'

const BytesSection = dynamic(() => import('./BytesSection'), {
  loading: () => <BytesShimmer />
})

const Home: React.FC = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags title={t`Home`} />
      <Banner />
      <DispatcherAlert />
      <BytesSection />
      <HomeFeed />
    </>
  )
}

export default Home
