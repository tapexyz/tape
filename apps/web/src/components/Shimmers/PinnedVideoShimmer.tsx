import React from 'react'

import { CardShimmer } from './VideoCardShimmer'

const PinnedVideoShimmer = () => {
  return (
    <div className="mb-4 mt-6">
      <div className="mb-4 h-6 w-44 rounded-md bg-gray-200 dark:bg-gray-800" />
      <div className="mb-5 hidden grid-cols-3 lg:grid">
        <div className="col-span-1">
          <CardShimmer />
        </div>
        <div className="col-span-2 flex flex-col justify-between p-3">
          <div className="h-5 w-1/2 rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="hidden items-center space-x-3 lg:flex">
            <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="hidden h-3 rounded bg-gray-200 lg:block dark:bg-gray-800" />
            <div className="hidden h-3 w-2/3 rounded bg-gray-200 lg:block dark:bg-gray-800" />
            <div className="h-3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="mt-4">
            <div className="h-3 w-1/6 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinnedVideoShimmer
