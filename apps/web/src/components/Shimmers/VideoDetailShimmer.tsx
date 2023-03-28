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

export const VideoDetailShimmer = () => {
  return (
    <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
      <div className="col-span-3">
        <CardShimmer rounded={false} />
        <div className="mt-3 flex flex-1 animate-pulse flex-col space-y-3.5">
          <div>
            <div className="my-2 h-5 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center space-x-3">
              <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
          <div className="my-4 flex items-center justify-end space-x-3">
            <div className="h-6 w-10 rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-6 w-10 rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-6 w-10 rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-6 w-20 rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-6 w-20 rounded-md bg-gray-300 dark:bg-gray-700" />
          </div>
          <hr className="border border-gray-200 dark:border-gray-800" />
          <div className="flex w-full items-center justify-between">
            <span className="flex flex-1 items-center space-x-2">
              <div className="h-11 w-11 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex flex-1 flex-col space-y-1.5">
                <div className="h-3.5 rounded-md bg-gray-300 dark:bg-gray-700 md:w-1/2" />
                <div className="h-3 w-1/2 rounded-md bg-gray-300 dark:bg-gray-700 md:w-1/4" />
              </div>
            </span>
            <span className="flex flex-1 items-center justify-end space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-10 w-1/2 rounded-xl bg-gray-300 dark:bg-gray-700 md:w-1/3" />
            </span>
          </div>
          <div className="ml-12 mt-4 space-y-3">
            <div className="h-3 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-3 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <SuggestedVideosShimmer />
    </div>
  )
}
