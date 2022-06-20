import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import Recents from '@components/Explore/Recents'
import useAppStore from '@lib/store'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Recommended = dynamic(() => import('./Recommended'))
const Trending = dynamic(() => import('../Explore/Trending'))

const Home: NextPage = () => {
  const { isAuthenticated } = useAppStore()

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
