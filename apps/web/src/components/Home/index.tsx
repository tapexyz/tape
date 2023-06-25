import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import BytesSection from './BytesSection'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags title={t`Home`} />
      <DispatcherAlert />
      <BytesSection />
      <HomeFeed />
    </>
  )
}

export default Home
