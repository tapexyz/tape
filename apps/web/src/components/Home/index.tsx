import useAuthPersistStore from '@lib/store/auth'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { getIsFeatureEnabled } from '@tape.xyz/generic'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import Feed from './Feed'
import OpenActions from './FEOpenActions'
import TopSection from './TopSection'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
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
      ) && <OpenActions />}

      <TopSection />
      {/* <LiveSection /> */}
      <Feed />
    </div>
  )
}

export default Home
