import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import LiveStudio from './Studio'

const GoLive = () => {
  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Go Live" />
      <LiveStudio />
    </div>
  )
}

export default GoLive
