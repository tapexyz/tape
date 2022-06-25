import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import HomeFeed from '@components/Home/Feed'
import { NextPage } from 'next'

const Feed: NextPage = () => {
  return (
    <Layout>
      <MetaTags />
      <div className="md:my-5">
        <HomeFeed />
      </div>
    </Layout>
  )
}

export default Feed
