import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import Details from './Details'

const UploadSteps = () => {
  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Video Details" />
      <div className="mt-10">
        <Details />
      </div>
    </div>
  )
}

export default UploadSteps
