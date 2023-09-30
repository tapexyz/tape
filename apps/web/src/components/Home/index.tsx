import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { FEATURE_FLAGS } from '@lenstube/constants'
import { getIsFeatureEnabled } from '@lenstube/generic'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import BytesSection from './BytesSection'
import CrossChainCollects from './Collects'
import DispatcherAlert from './DispatcherAlert'
import HomeFeed from './Feed'

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
      <BytesSection />
      {getIsFeatureEnabled(
        FEATURE_FLAGS.CROSS_CHAIN_COLLECTS,
        selectedSimpleProfile?.id
      ) && <CrossChainCollects />}
      <HomeFeed />
    </>
  )
}

export default Home
