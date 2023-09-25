import { Analytics, TRACK } from '@lenstube/browser'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      {/* <GitcoinAlert /> */}
      <DispatcherAlert />
      <HomeFeed />
    </>
  )
}

export default Home
