import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import CategoriesShimmer from '@components/Shimmers/CategoriesShimmer'
import dynamic from 'next/dynamic'

const Categories = dynamic(() => import('./Categories'), {
  loading: () => <CategoriesShimmer />,
  ssr: false
})
const Feed = dynamic(() => import('./Feed'))

const Explore = () => {
  return (
    <Layout>
      <MetaTags title="Explore" />
      <Categories />
      <div className="md:my-5">
        <Feed />
      </div>
    </Layout>
  )
}

export default Explore
