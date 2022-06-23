import MetaTags from '@components/Common/MetaTags'
import CategoriesShimmer from '@components/Shimmers/CategoriesShimmer'
import dynamic from 'next/dynamic'

const Categories = dynamic(() => import('./Categories'), {
  loading: () => <CategoriesShimmer />
})
const Feed = dynamic(() => import('./Feed'))

const Explore = () => {
  return (
    <>
      <MetaTags title="Explore" />
      <Categories />
      <div className="md:my-5">
        <Feed />
      </div>
    </>
  )
}

export default Explore
