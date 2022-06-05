import React from 'react'

import TimelineShimmer from './TimelineShimmer'

const ChannelShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col md:space-x-4 animate-pulse">
        <div className="bg-gray-300 rounded-md h-44 md:h-72 dark:bg-gray-700"></div>
        <div className="flex items-center p-2 space-x-4">
          <div className="bg-gray-300 border-2 rounded-full w-14 h-14 md:-mt-10 md:w-32 md:h-32 dark:bg-gray-700"></div>
          <div className="flex-1 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700"></div>
              <div className="h-3 col-span-1 bg-gray-300 rounded dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-7 md:mt-6">
        <div className="col-span-1 space-y-2 md:mt-3">
          <div className="items-center justify-center hidden space-x-2 md:flex">
            <div className="w-4 h-4 bg-gray-300 rounded-md dark:bg-gray-700"></div>
            <div className="w-1/2 h-3 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
          <div className="items-center justify-center hidden space-x-2 md:flex">
            <div className="w-4 h-4 bg-gray-300 rounded-md dark:bg-gray-700"></div>
            <div className="w-1/2 h-3 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
          <div className="items-center justify-center hidden space-x-2 md:flex">
            <div className="w-4 h-4 bg-gray-300 rounded-md dark:bg-gray-700"></div>
            <div className="w-1/2 h-3 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="w-full col-span-6">
          <TimelineShimmer />
        </div>
      </div>
    </div>
  )
}

export default ChannelShimmer
