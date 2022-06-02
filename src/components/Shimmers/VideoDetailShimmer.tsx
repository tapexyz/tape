import React from 'react'

import SuggestedShimmer from './SuggestedShimmer'
import VideoCardShimmer from './VideoCardShimmer'

export const SuggestedVideosShimmer = () => (
  <div className="col-span-1 space-y-2">
    <SuggestedShimmer />
    <SuggestedShimmer />
    <SuggestedShimmer />
    <SuggestedShimmer />
  </div>
)

const VideoDetailShimmer = () => {
  return (
    <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
      <div className="col-span-3">
        <VideoCardShimmer />
      </div>
      <SuggestedVideosShimmer />
    </div>
  )
}

export default VideoDetailShimmer
