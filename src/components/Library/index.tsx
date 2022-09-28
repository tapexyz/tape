import MetaTags from '@components/Common/MetaTags'
import { Mixpanel, TRACK } from '@utils/track'
import { useEffect } from 'react'

import Commented from './Sections/Commented'
import Recents from './Sections/Recents'
import WatchLater from './Sections/WatchLater'

const Library = () => {
  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.LIBRARY })
  }, [])
  return (
    <>
      <MetaTags title="Library" />
      <div className="mb-4 space-y-4">
        <WatchLater />
        <Recents />
        <Commented />
      </div>
    </>
  )
}

export default Library
