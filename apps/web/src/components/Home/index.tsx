import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { FEATURE_FLAGS } from '@lenstube/constants'
import { getIsFeatureEnabled } from '@lenstube/generic'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import BytesSection from './BytesSection'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'
import OpenActions from './OpenActions'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <>
      <MetaTags title={t`Home`} />
      {/* <GitcoinAlert /> */}
      <DispatcherAlert />
      {getIsFeatureEnabled(
        FEATURE_FLAGS.OPEN_ACTIONS,
        selectedSimpleProfile?.id
      ) && <OpenActions />}
      <BytesSection />
      <HomeFeed />
    </>
  )
}

export default Home
