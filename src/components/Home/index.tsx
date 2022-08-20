import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import DispatcherAlert from './DispatcherAlert'
import FeedFilters from './FeedFilters'

const Recents = dynamic(() => import('../Explore/Recents'), {
  loading: () => <TimelineShimmer />
})

const Home: NextPage = () => {
  return (
    <>
      <MetaTags />
      <DispatcherAlert />
      <FeedFilters />
      <div className="md:my-2">
        <Recents />
      </div>
    </>
  )
}

export default Home
