import React from 'react'
import { STATIC_ASSETS } from 'utils'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-bounce">
        <img
          src={`${STATIC_ASSETS}/images/brand/christmas.png`}
          draggable={false}
          className="w-20 h-20 ml-6 mb-6"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
