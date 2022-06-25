import Layout from '@components/Common/Layout'
import dynamic from 'next/dynamic'
const Notifications = dynamic(() => import('../components/Notifications'))

const notifications = () => {
  return (
    <Layout>
      <Notifications />
    </Layout>
  )
}

export default notifications
