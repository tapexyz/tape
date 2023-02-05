import React from 'react'

import ButtonShimmer from './ButtonShimmer'

const ChannelCardShimmer = () => {
  return (
    <div className="flex w-40 animate-pulse flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-900">
      <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="w-full px-1.5 py-2">
        <div className="flex-1 space-y-2">
          <div className="mx-1">
            <div className="col-span-2 mb-1 h-3.5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="col-span-2 h-2 rounded bg-gray-200 dark:bg-gray-700" />
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
