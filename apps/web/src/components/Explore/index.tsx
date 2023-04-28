import MetaTags from '@components/Common/MetaTags'
import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import ExploreFeed from './Feed'

const Explore = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <>
      <MetaTags title={t`Explore`} />
      <ExploreFeed />
    </>
  )
}

export default Explore
