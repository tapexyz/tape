import MetaTags from '@components/Common/MetaTags'
import BytesShimmer from '@components/Shimmers/BytesShimmer'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'
import Banner from './Banner'
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
      <MetaTags title={t`Home`} />
      <Banner />
      <DispatcherAlert />
      <BytesSection />
      <HomeFeed />
    </>
  )
}

export default Home
