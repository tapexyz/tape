import MetaTags from '@components/Common/MetaTags'
import useProfileStore from '@lib/store/profile'
import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { EVENTS, getIsFeatureEnabled, Tower } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import Feed from './Feed'
import New from './New'

const Bangers = () => {
  const { activeProfile } = useProfileStore()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.FEED })
  }, [])

  if (!getIsFeatureEnabled(FEATURE_FLAGS.BANGERS, activeProfile?.id)) {
    // return <Custom404 />
  }

  return (
    <div>
      <MetaTags title="Only Bangers" />
      <New />
      <div className="tape-border container mx-auto max-w-screen-sm !border-y-0">
        <Feed />
      </div>
    </div>
  )
}

export default Bangers
