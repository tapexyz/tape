import { STATIC_ASSETS } from '@tape.xyz/constants'
import React from 'react'

import HomeOutline from './Icons/HomeOutline'

const FloatingNav = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-brand-100/60 dark:bg-brand-900/60 fixed bottom-6 z-10 rounded-full px-6 py-4 backdrop-blur-xl">
        <div>
          <img
            src={`${STATIC_ASSETS}/brand/logo.svg`}
            className="h-6"
            alt="tape"
          />
          <HomeOutline className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export default FloatingNav
