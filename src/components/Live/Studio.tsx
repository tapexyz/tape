import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import Details from './Details'

const LiveStudio = () => {
  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Go Live" />
      <div className="mt-10">
        <Details />
      </div>
    </div>
  )
}

export default LiveStudio
