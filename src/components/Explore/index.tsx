import MetaTags from '@components/Common/MetaTags'
import CategoriesShimmer from '@components/Shimmers/CategoriesShimmer'
import { Mixpanel, TRACK } from '@utils/track'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import ExploreFeed from './Feed'

const Categories = dynamic(() => import('./Categories'), {
  loading: () => <CategoriesShimmer />
})

const Explore = () => {
  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.EXPLORE)
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
