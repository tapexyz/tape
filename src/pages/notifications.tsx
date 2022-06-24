import dynamic from 'next/dynamic'
import React from 'react'
const Notifications = dynamic(() => import('../components/Notifications'))

const notifications = () => {
  return <Notifications />
}

export default notifications
