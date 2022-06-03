import Layout from '@components/CommonT/Layout'
import MetaTags from '@components/CommonT/MetaTags'
import dynamic from 'next/dynamic'

const Commented = dynamic(() => import('./Sections/Commented'))
const Recents = dynamic(() => import('./Sections/Recents'))
const WatchLater = dynamic(() => import('./Sections/WatchLater'))

const Library = () => {
  return (
    <Layout>
      <MetaTags title="Library" />
      <WatchLater />
      <Recents />
      <Commented />
    </Layout>
  )
}

export default Library
