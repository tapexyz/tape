import { useContext } from 'react'

import { ServiceWorkerContext } from '@/components/Common/Providers/ServiceWorkerProvider'

const useSw = () => {
  const context = useContext(ServiceWorkerContext)
  if (!context) {
    throw new Error('[SW] useSw must be used within a ServiceWorkerProvider')
  }
  return context
}

export default useSw
