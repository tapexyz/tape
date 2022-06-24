import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import usePersistStore from '@lib/store/persist'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Recommended = dynamic(() => import('./Recommended'))
const HomeFeed = dynamic(() => import('./Feed'), {
  loading: () => <TimelineShimmer />
})
const Trending = dynamic(() => import('../Explore/Trending'), {
  loading: () => <TimelineShimmer />
})

const Home: NextPage = () => {
  const { isAuthenticated } = usePersistStore()

  return (
    <>
      <MetaTags />
      <Recommended />
      <div className="md:my-5">
        {isAuthenticated ? <HomeFeed /> : <Trending />}
      </div>
    </>
  )
}

export default Home
