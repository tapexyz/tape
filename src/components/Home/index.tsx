import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import Trending from '@components/Explore/Trending'
import useAppStore from '@lib/store'
import useIsMounted from '@utils/hooks/useIsMounted'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useConnect } from 'wagmi'

const Recommended = dynamic(() => import('./Recommended'))
const HomeFeed = dynamic(() => import('./Feed'))

const Home: NextPage = () => {
  const { isAuthenticated } = useAppStore()
  const { activeConnector } = useConnect()

  const isMounted = useIsMounted()

  return (
    <Layout>
      <MetaTags />
      <Recommended />
      <div className="md:my-5">
        {isMounted() && (
          <>
            {isAuthenticated && activeConnector ? <HomeFeed /> : <Trending />}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Home
