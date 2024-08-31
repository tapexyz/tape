import { FEATURE_FLAGS } from '@tape.xyz/constants'
import { EVENTS, getIsFeatureEnabled } from '@tape.xyz/generic'
import React, { useEffect } from 'react'
import Custom404 from 'src/pages/404'

import MetaTags from '@/components/Common/MetaTags'
import useSw from '@/hooks/useSw'
import useProfileStore from '@/lib/store/idb/profile'

import Feed from './Feed'

const Bangers = () => {
  const { activeProfile } = useProfileStore()
  const { addEventToQueue } = useSw()

  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.FEED })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
