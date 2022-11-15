import MetaTags from '@components/Common/MetaTags'
import HomeFeed from '@components/Feed/Feed'
import type { NextPage } from 'next'

const Feed: NextPage = () => {
  return (
    <>
      <MetaTags />
      <HomeFeed />
    </>
  )
}

export default Feed
