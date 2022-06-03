import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import dynamic from 'next/dynamic'

const Categories = dynamic(() => import('./Categories'))
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
