import React from 'react'

import VideoCardShimmer from './VideoCardShimmer'

const PinnedVideoShimmer = () => {
  return (
    <div className="my-4 grid grid-cols-5">
      <div className="col-span-1">
        <VideoCardShimmer />
      </div>
    </div>
  )
}

export default PinnedVideoShimmer
