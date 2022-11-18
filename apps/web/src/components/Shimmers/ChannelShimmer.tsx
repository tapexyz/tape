import React from 'react'

import TimelineShimmer from './TimelineShimmer'

const ChannelShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col md:space-x-4 animate-pulse">
        <div className="bg-gray-300 rounded-lg h-44 md:h-72 dark:bg-gray-700" />
        <div className="flex items-center p-2 space-x-4">
          <div className="w-20 h-20 bg-gray-300 border-4 dark:border-gray-900 rounded-xl md:-mt-10 md:w-32 md:h-32 dark:bg-gray-700" />
          <div className="flex-1 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 col-span-1 bg-gray-300 rounded dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6">
        <TimelineShimmer />
      </div>
    </div>
  )
}

export default ChannelShimmer
