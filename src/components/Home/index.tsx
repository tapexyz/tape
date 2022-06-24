import MetaTags from '@components/Common/MetaTags'
import Trending from '@components/Explore/Trending'
import usePersistStore from '@lib/store/persist'
import { NextPage } from 'next'

import HomeFeed from './Feed'
import Recommended from './Recommended'

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
