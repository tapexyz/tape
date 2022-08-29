import React from 'react'
import { useMemo } from 'react'

import SuggestedShimmer from './SuggestedShimmer'
import { CardShimmer } from './VideoCardShimmer'

export const SuggestedVideosShimmer = () => {
  const cards = useMemo(() => Array(8).fill(1), [])

  return (
    <div className="hidden col-span-1 space-y-2 md:block">
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
        <CardShimmer />
        <div className="flex flex-col flex-1 mt-4 animate-pulse">
          <div className="w-full h-4 my-2 bg-gray-300 rounded-md dark:bg-gray-700" />
          <div className="flex items-center space-x-3">
            <div className="w-1/6 h-3 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-1/6 h-3 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-1/6 h-3 bg-gray-300 rounded-md dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-end my-4 space-x-3">
            <div className="w-10 h-5 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-10 h-5 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-10 h-5 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-1/6 h-5 bg-gray-300 rounded-md dark:bg-gray-700" />
            <div className="w-1/6 h-5 bg-gray-300 rounded-md dark:bg-gray-700" />
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center flex-1 space-x-2">
              <div className="bg-gray-300 rounded-full w-11 h-11 dark:bg-gray-700" />
              <div className="flex flex-col flex-1 space-y-1">
                <div className="h-3 bg-gray-300 rounded-md md:w-1/2 dark:bg-gray-700" />
                <div className="w-1/2 h-3 bg-gray-300 rounded-md md:w-1/4 dark:bg-gray-700" />
              </div>
            </span>
            <span className="flex items-center justify-end flex-1 space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-xl dark:bg-gray-700" />
              <div className="w-1/2 h-10 bg-gray-300 md:w-1/3 rounded-xl dark:bg-gray-700" />
            </span>
          </div>
          <div className="mt-4 ml-12 space-y-2">
            <div className="h-3 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-3 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-3 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-3 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <SuggestedVideosShimmer />
    </div>
  )
}
