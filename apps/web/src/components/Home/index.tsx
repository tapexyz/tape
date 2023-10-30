import useProfileStore from '@lib/store/profile'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { EVENTS, getIsFeatureEnabled, Tower } from '@tape.xyz/generic'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import Feed from './Feed'
import FEOpenActions from './FEOpenActions'
import TopSection from './TopSection'

const Home: NextPage = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.HOME })
  }, [])

  const { activeProfile } = useProfileStore()

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      {/* <WhatsPopping /> */}
      {getIsFeatureEnabled(FEATURE_FLAGS.OPEN_ACTIONS, activeProfile?.id) && (
        <FEOpenActions />
      )}

      <TopSection />
      {/* <LiveSection /> */}
      <Feed />
    </div>
  )
}

export default Home
