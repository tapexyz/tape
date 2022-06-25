import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Recents = dynamic(() => import('../Explore/Recents'), {
  loading: () => <TimelineShimmer />
})

const Home: NextPage = () => {
  return (
    <Layout>
      <MetaTags />
      {/* <Recommended /> */}
      <div className="md:my-5">
        <Recents />
      </div>
    </Layout>
  )
}

export default Home
