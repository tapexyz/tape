import { Loader } from '@components/UIElements/Loader'
import dynamic from 'next/dynamic'

const Notifications = dynamic(() => import('../components/Notifications'), {
  loading: () => <Loader />
})

const notifications = () => {
  return <Notifications />
}

export default notifications
