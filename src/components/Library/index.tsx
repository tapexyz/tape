import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import dynamic from 'next/dynamic'

const Commented = dynamic(() => import('./Sections/Commented'))
const Recents = dynamic(() => import('./Sections/Recents'))
const WatchLater = dynamic(() => import('./Sections/WatchLater'))

const Library = () => {
  return (
    <Layout>
      <MetaTags title="Library" />
      <div className="mb-4 space-y-4">
        <WatchLater />
        <Recents />
        <Commented />
      </div>
    </Layout>
  )
}

export default Library
