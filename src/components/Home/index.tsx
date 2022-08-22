import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import FeedFilters from './FeedFilters'

const DispatcherAlert = dynamic(() => import('./DispatcherAlert'))
const LooksRare = dynamic(() => import('../Explore/LooksRare'), {
  loading: () => <TimelineShimmer />
})

const Home: NextPage = () => {
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
