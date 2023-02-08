import MetaTags from '@components/Common/MetaTags'
import HomeFeed from '@components/Feed/Feed'
import type { NextPage } from 'next'
import React from 'react'

const Feed: NextPage = () => {
  return (
    <>
      <MetaTags title="Subscriptions" />
      <HomeFeed />
    </>
  )
}

export default Feed
