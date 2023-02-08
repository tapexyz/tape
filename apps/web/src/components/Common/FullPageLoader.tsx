import React from 'react'
import { STATIC_ASSETS } from 'utils'
import imageCdn from 'utils/functions/imageCdn'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags title="Loading..." />
      <div className="animate-bounce">
        <img
          src={imageCdn(`${STATIC_ASSETS}/images/brand/circle-blue-72x72.png`)}
          draggable={false}
          className="h-12 w-12"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
