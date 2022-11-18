import React from 'react'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-pulse">
        <img
          src="/lenstube.svg"
          draggable={false}
          className="w-12 h-12"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
