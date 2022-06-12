import React from 'react'

const VideoCardShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 rounded-t-lg aspect-w-16 aspect-h-9 dark:bg-gray-700"></div>
        <div className="flex py-3 space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-700"></div>
          <div className="flex-1 py-1 space-y-2">
            <span className="space-y-2">
              <div className="h-2 bg-gray-300 rounded dark:bg-gray-700"></div>
              <div className="h-2 bg-gray-300 rounded dark:bg-gray-700"></div>
            </span>
            <div>
              <div className="grid grid-cols-3">
                <div className="h-2 col-span-2 bg-gray-300 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardShimmer
