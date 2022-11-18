import MetaTags from '@components/Common/MetaTags'
import Curated from '@components/Home/Curated'
import { Analytics, TRACK } from '@utils/analytics'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import BytesSection from './BytesSection'
import DispatcherAlert from './DispatcherAlert'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags />
      <DispatcherAlert />
      <div className="hidden lg:block">
        <BytesSection />
      </div>
      <Curated />
    </>
  )
}

export default Home
