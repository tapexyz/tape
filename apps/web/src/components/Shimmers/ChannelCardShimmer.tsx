import React from 'react'

import ButtonShimmer from './ButtonShimmer'

const ChannelCardShimmer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-40 py-3 border border-gray-200 animate-pulse rounded-xl dark:border-gray-900">
      <div className="w-24 h-24 bg-gray-200 rounded-full dark:bg-gray-700" />
      <div className="w-full px-1.5 py-2">
        <div className="flex-1 space-y-2">
          <div className="mx-1">
            <div className="h-3.5 mb-1 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="h-2 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
          <div className="flex justify-center">
            <ButtonShimmer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelCardShimmer
