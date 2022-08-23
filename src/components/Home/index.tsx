import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Mixpanel, TRACK } from '@utils/track'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import FeedFilters from './FeedFilters'

const DispatcherAlert = dynamic(() => import('./DispatcherAlert'))
const LooksRare = dynamic(() => import('../Explore/LooksRare'), {
  loading: () => <TimelineShimmer />
})

const Home: NextPage = () => {
  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.HOME)
  }, [])
  return (
    <>
      <MetaTags />
      <DispatcherAlert />
      <FeedFilters />
      <div className="md:my-2">
        <LooksRare />
      </div>
    </>
  )
}

export default Home
