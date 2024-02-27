import React, { useMemo } from 'react'

import SuggestedShimmer from './SuggestedShimmer'
import { CardShimmer } from './VideoCardShimmer'

export const SuggestedVideosShimmer = () => {
  const cards = useMemo(() => Array(16).fill(1), [])

  return (
    <div className="col-span-1 space-y-2">
      {cards.map((i, idx) => (
        <SuggestedShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export const WatchShimmer = () => {
  return (
    <div className="max-w-screen-ultrawide mx-auto grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
      <div className="col-span-3">
        <CardShimmer />
        <div className="animate-shimmer mt-3 flex flex-1 flex-col space-y-3.5">
          <div>
            <div className="my-2 h-5 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="flex items-center space-x-3">
              <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div className="my-4 flex items-center justify-end space-x-3">
            <div className="h-6 w-10 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-10 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
      <SuggestedVideosShimmer />
    </div>
  )
}
