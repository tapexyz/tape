import React from 'react'

import ButtonShimmer from './ButtonShimmer'
import TimelineShimmer from './TimelineShimmer'

const ChannelShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex animate-pulse flex-col md:space-x-4">
        <div className="h-44 bg-gray-300 dark:bg-gray-700 md:h-72" />
        <div className="flex items-center space-x-4 p-2">
          <div className="h-20 w-20 flex-none rounded-xl border-4 bg-gray-300 dark:border-gray-900 dark:bg-gray-700 md:-mt-10 md:h-32 md:w-32" />
          <div className="flex w-full items-end">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div className="col-span-2 h-4 rounded bg-gray-300 dark:bg-gray-700 md:w-1/3" />
              <div className="col-span-1 h-3 rounded bg-gray-300 dark:bg-gray-700 md:w-1/3" />
            </div>
            <div className="hidden md:block">
              <ButtonShimmer />
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
