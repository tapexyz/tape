import useAuthPersistStore from '@lib/store/auth'
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

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      {/* <WhatsPopping /> */}
      {getIsFeatureEnabled(
        FEATURE_FLAGS.OPEN_ACTIONS,
        selectedSimpleProfile?.id
      ) && <FEOpenActions />}

      <TopSection />
      {/* <LiveSection /> */}
      <Feed />
    </div>
  )
}

export default Home
