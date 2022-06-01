import React from 'react'

import VideoCardShimmer from './VideoCardShimmer'

const TimelineShimmer = () => {
  return (
    <div className="grid gap-x-4 lg:grid-cols-4 md:gap-y-6 gap-y-1 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
      <VideoCardShimmer />
    </div>
  )
}

export default TimelineShimmer
