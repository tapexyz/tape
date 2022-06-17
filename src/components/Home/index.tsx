import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import Trending from '@components/Explore/Trending'
import useAppStore from '@lib/store'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useConnect } from 'wagmi'

const Recommended = dynamic(() => import('./Recommended'))
const HomeFeed = dynamic(() => import('./Feed'))

const Home: NextPage = () => {
  const { isAuthenticated, selectedChannel } = useAppStore()
  const { activeConnector } = useConnect()

  return (
    <Layout>
      <MetaTags />
      <Recommended />
      <div className="md:my-5">
        {isAuthenticated && activeConnector && selectedChannel ? (
          <HomeFeed />
        ) : (
          <Trending />
        )}
      </div>
    </Layout>
  )
}

export default Home
