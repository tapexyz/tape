import React from 'react'

import ButtonShimmer from './ButtonShimmer'
import TimelineShimmer from './TimelineShimmer'

const ChannelShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col md:space-x-4 animate-pulse">
        <div className="bg-gray-300 rounded-lg h-44 md:h-72 dark:bg-gray-700" />
        <div className="flex items-center p-2 space-x-4">
          <div className="w-20 h-20 flex-none bg-gray-300 border-4 dark:border-gray-900 rounded-xl md:-mt-10 md:w-32 md:h-32 dark:bg-gray-700" />
          <div className="flex w-full items-end">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div className="h-4 md:w-1/3 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 col-span-1 md:w-1/3 bg-gray-300 rounded dark:bg-gray-700" />
            </div>
            <ButtonShimmer />
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
