import MetaTags from '@components/Common/MetaTags'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { getIsFeatureEnabled } from '@tape.xyz/generic'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import DispatcherAlert from './DispatcherAlert'
import Feed from './Feed'
import OpenActions from './OpenActions'
import TopSection from './TopSection'

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
      <DispatcherAlert />
      {/* <GitcoinAlert /> */}
      {/* <WhatsPopping /> */}
      {getIsFeatureEnabled(
        FEATURE_FLAGS.OPEN_ACTIONS,
        selectedSimpleProfile?.id
      ) && <OpenActions />}

      <TopSection />
      <Feed />
    </>
  )
}

export default Home
