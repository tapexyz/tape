import React from 'react'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
      <div className="animate-bounce">
        <img
          src="/lenstube.svg"
          draggable={false}
          className="w-10 h-10"
          alt="lenstube"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
