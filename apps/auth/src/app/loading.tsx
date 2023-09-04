'use client'

import { Loader } from '@lenstube/ui'
import React from 'react'

const loading = () => {
  return (
    <div className="grid h-screen place-items-center">
      <Loader />
    </div>
  )
}

export default loading
