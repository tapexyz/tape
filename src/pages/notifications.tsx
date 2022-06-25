import dynamic from 'next/dynamic'
const Notifications = dynamic(() => import('../components/Notifications'))

const notifications = () => {
  return <Notifications />
}

export default notifications
