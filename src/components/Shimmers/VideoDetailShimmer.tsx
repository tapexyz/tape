import React from 'react'
import { useMemo } from 'react'

import SuggestedShimmer from './SuggestedShimmer'
import VideoCardShimmer from './VideoCardShimmer'

export const SuggestedVideosShimmer = () => {
  const cards = useMemo(() => Array(8).fill(1), [])

  return (
    <div className="col-span-1 space-y-2">
      {cards.map((i, idx) => (
        <SuggestedShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export const VideoDetailShimmer = () => {
  return (
    <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
      <div className="col-span-3">
        <VideoCardShimmer />
      </div>
      <SuggestedVideosShimmer />
    </div>
  )
}
