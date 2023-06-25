import { STATIC_ASSETS } from '@lenstube/constants'
import React from 'react'
import imageCdn from 'utils/functions/imageCdn'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-bounce">
        <img
          src={imageCdn(`${STATIC_ASSETS}/images/brand/lenstube.svg`)}
          draggable={false}
          className="h-12 w-12 md:h-16 md:w-16"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
