import React from 'react'
import { STATIC_ASSETS } from 'utils'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-pulse">
        <img
          src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
          draggable={false}
          className="w-12 h-12"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
