import MetaTags from '@components/Common/MetaTags'
import useProfileStore from '@lib/store/idb/profile'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { EVENTS, getIsFeatureEnabled, Tower } from '@tape.xyz/generic'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'

import Feed from './Feed'

const Bangers = () => {
  const { activeProfile } = useProfileStore()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.FEED })
  }, [])

  if (!getIsFeatureEnabled(FEATURE_FLAGS.BANGERS, activeProfile?.id)) {
    return <Custom404 />
  }

  return (
    <div className="pt-14">
      <MetaTags title="Only Bangers" />
      <Feed />
    </div>
  )
}

export default Bangers
