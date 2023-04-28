import MetaTags from '@components/Common/MetaTags'
import Subscriptions from '@components/Subscriptions/Feed'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React from 'react'

const Feed: NextPage = () => {
  return (
    <>
      <MetaTags title={t`Subscriptions`} />
      <Subscriptions />
    </>
  )
}

export default Feed
