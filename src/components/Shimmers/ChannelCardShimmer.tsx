import React from 'react'

const ChannelCardShimmer = () => {
  return (
    <div className="flex flex-col w-40 animate-pulse">
      <div className="h-32 bg-gray-300 rounded-xl dark:bg-gray-700"></div>
      <div className="flex items-center px-1">
        <div className="flex-1 py-5">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-3 col-span-1 bg-gray-300 rounded dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelCardShimmer
