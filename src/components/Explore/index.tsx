import MetaTags from '@components/Common/MetaTags'
import CategoriesShimmer from '@components/Shimmers/CategoriesShimmer'
import dynamic from 'next/dynamic'

import ExploreFeed from './Feed'

const Categories = dynamic(() => import('./Categories'), {
  loading: () => <CategoriesShimmer />
})

const Explore = () => {
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
