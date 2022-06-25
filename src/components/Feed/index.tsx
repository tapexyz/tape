import MetaTags from '@components/Common/MetaTags'
import HomeFeed from '@components/Home/Feed'
import { NextPage } from 'next'

const Feed: NextPage = () => {
  return (
    <>
      <MetaTags />
      <div className="md:my-5">
        <HomeFeed />
      </div>
    </>
  )
}

export default Feed
