import MetaTags from '@components/Common/MetaTags'
import usePersistStore from '@lib/store/persist'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const HomeFeed = dynamic(() => import('./Feed'))
const Recommended = dynamic(() => import('./Recommended'))
const Trending = dynamic(() => import('../Explore/Trending'))

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
