import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@utils/analytics'
import { useEffect } from 'react'

import Categories from './Categories'
import ExploreFeed from './Feed'

const Explore = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <>
      <MetaTags title="Explore" />
      <Categories />
      <div className="md:my-5">
        <ExploreFeed />
      </div>
    </>
  )
}

export default Explore
