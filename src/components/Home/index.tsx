import MetaTags from '@components/Common/MetaTags'
import Curated from '@components/Explore/Curated'
import { Mixpanel, TRACK } from '@utils/track'
import { NextPage } from 'next'
import { useEffect } from 'react'

import DispatcherAlert from './DispatcherAlert'
import FeedFilters from './FeedFilters'

const Home: NextPage = () => {
  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags />
      <DispatcherAlert />
      <FeedFilters />
      <div className="md:my-2">
        <Curated />
      </div>
    </>
  )
}

export default Home
