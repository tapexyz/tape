import useProfileStore from '@lib/store/profile'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { EVENTS, getIsFeatureEnabled, Tower } from '@tape.xyz/generic'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import Feed from './Feed'
import Streams from './Streams'
import TopSection from './TopSection'

const Home: NextPage = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.HOME })
  }, [])

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <TopSection />
      {getIsFeatureEnabled(FEATURE_FLAGS.STREAMS, activeProfile?.id) && (
        <Streams />
      )}
      <Feed />
    </div>
  )
}

export default Home
