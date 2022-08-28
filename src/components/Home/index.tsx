import MetaTags from '@components/Common/MetaTags'
import LooksRare from '@components/Explore/LooksRare'
import { Mixpanel, TRACK } from '@utils/track'
import { NextPage } from 'next'
import { useEffect } from 'react'

import DispatcherAlert from './DispatcherAlert'
import FeedFilters from './FeedFilters'

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
