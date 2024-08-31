import { EVENTS } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import CategoryFilters from '@/components/Common/CategoryFilters'
import MetaTags from '@/components/Common/MetaTags'
import useSw from '@/hooks/useSw'

import ExploreFeed from './Feed'

const Explore = () => {
  const { addEventToQueue } = useSw()

  useEffect(() => {
    addEventToQueue(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.EXPLORE })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <MetaTags title="Explore" />
      <CategoryFilters heading="Everything" />
      <ExploreFeed />
    </div>
  )
}

export default Explore
