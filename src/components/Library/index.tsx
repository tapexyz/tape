import MetaTags from '@components/Common/MetaTags'
import { Mixpanel, TRACK } from '@utils/track'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Commented = dynamic(() => import('./Sections/Commented'))
const Recents = dynamic(() => import('./Sections/Recents'))
const WatchLater = dynamic(() => import('./Sections/WatchLater'))

const Library = () => {
  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.LIBRARY)
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
