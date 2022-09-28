import MetaTags from '@components/Common/MetaTags'
import { Mixpanel, TRACK } from '@utils/track'
import { useEffect } from 'react'

import Categories from './Categories'
import ExploreFeed from './Feed'

const Explore = () => {
  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
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
