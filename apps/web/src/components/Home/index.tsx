import MetaTags from '@components/Common/MetaTags'
import Curated from '@components/Home/Curated'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import BytesSection from './BytesSection'
import DispatcherAlert from './DispatcherAlert'
import ProfileInterests from './ProfileInterests'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags />
      <DispatcherAlert />
      <ProfileInterests />
      <div className="hidden lg:block">
        <BytesSection />
      </div>
      <Curated />
    </>
  )
}

export default Home
