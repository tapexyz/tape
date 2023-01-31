import React from 'react'

import ButtonShimmer from './ButtonShimmer'
import TimelineShimmer from './TimelineShimmer'

const ChannelShimmer = () => {
  return (
    <>
      <div className="flex animate-pulse flex-col">
        <div className="ultrawide:h-[35vh] h-44 bg-gray-300 dark:bg-gray-700 md:h-[20vw]" />
        <div className="mx-auto flex w-full max-w-[85rem] items-center space-x-4 p-2 md:py-5">
          <div className="ultrawide:h-32 ultrawide:w-32 h-24 w-24  flex-none rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex w-full items-end">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div className="col-span-2 h-5 rounded bg-gray-300 dark:bg-gray-700 md:w-1/3" />
              <div className="col-span-2 h-4 rounded bg-gray-300 dark:bg-gray-700 md:w-1/4" />
              <div className="col-span-1 h-3.5 rounded bg-gray-300 dark:bg-gray-700 md:w-1/3" />
            </div>
            <div className="hidden md:block">
              <ButtonShimmer />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[85rem] p-2">
        <div className="flex items-center space-x-2 pb-5 pt-2">
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-20 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <TimelineShimmer />
      </div>
    </>
  )
}

export default ChannelShimmer
