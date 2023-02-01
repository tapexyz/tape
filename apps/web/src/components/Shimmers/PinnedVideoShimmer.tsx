import React from 'react'

import { CardShimmer } from './VideoCardShimmer'

const PinnedVideoShimmer = () => {
  return (
    <div className="mb-5 hidden grid-cols-3 border-b border-gray-300 pb-3 dark:border-gray-700 lg:grid">
      <div className="col-span-1">
        <CardShimmer />
      </div>
      <div className="col-span-2 flex flex-col justify-between p-3">
        <div className="h-5 w-1/2 rounded-md bg-gray-300 dark:bg-gray-700" />
        <div className="hidden items-center space-x-3 lg:flex">
          <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="hidden h-3 rounded bg-gray-300 dark:bg-gray-700 lg:block" />
          <div className="hidden h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-700 lg:block" />
          <div className="h-3 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="mt-4">
          <div className="h-3 w-1/6 rounded-md bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default PinnedVideoShimmer
