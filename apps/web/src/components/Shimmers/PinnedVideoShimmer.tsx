import React from 'react'

import VideoCardShimmer from './VideoCardShimmer'

const PinnedVideoShimmer = () => {
  return (
    <div className="mb-5 grid border-b border-gray-300 pb-3 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-5">
      <div className="col-span-1">
        <VideoCardShimmer />
      </div>
    </div>
  )
}

export default PinnedVideoShimmer
