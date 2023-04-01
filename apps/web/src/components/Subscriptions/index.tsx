import MetaTags from '@components/Common/MetaTags'
import Subscriptions from '@components/Subscriptions/Feed'
import type { NextPage } from 'next'
import React from 'react'

const Feed: NextPage = () => {
  return (
    <>
      <MetaTags title="Subscriptions" />
      <Subscriptions />
    </>
  )
}

export default Feed
