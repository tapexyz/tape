import React from 'react'

import { Loader } from '@/components/Loader'

const loading = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Loader />
    </div>
  )
}

export default loading
