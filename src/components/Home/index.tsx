import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import usePersistStore from '@lib/store/persist'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Recents = dynamic(() => import('../Explore/Recents'))
const Recommended = dynamic(() => import('./Recommended'))
const Trending = dynamic(() => import('../Explore/Trending'))

const Home: NextPage = () => {
  const { isAuthenticated } = usePersistStore()

  return (
    <Layout>
      <MetaTags />
      <Recommended />
      <div className="md:my-5">
        {/* {isAuthenticated ? <HomeFeed /> : <Trending />} */}
        {isAuthenticated ? <Recents /> : <Trending />}
      </div>
    </Layout>
  )
}

export default Home
