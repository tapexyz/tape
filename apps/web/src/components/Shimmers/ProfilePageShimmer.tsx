import React from 'react'

import ButtonShimmer from './ButtonShimmer'
import TimelineShimmer from './TimelineShimmer'

const ProfilePageShimmer = () => {
  return (
    <>
      <div className="flex animate-pulse flex-col">
        <div className="ultrawide:h-[25vh] h-44 bg-gray-100 dark:bg-gray-800 md:h-[20vw]" />
        <div className="mx-auto flex w-full max-w-screen-xl items-center space-x-4 p-2 md:py-5 xl:px-0">
          <div className="flex w-full items-center py-4">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div className="col-span-2 h-5 rounded bg-gray-200 dark:bg-gray-800 md:w-1/3" />
              <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-800 md:w-1/4" />
              <div className="col-span-1 h-3.5 rounded bg-gray-200 dark:bg-gray-800 md:w-1/3" />
            </div>
            <div className="hidden gap-3 md:flex md:flex-col md:items-end">
              <ButtonShimmer />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl p-2 xl:px-0">
        <div className="no-scrollbar flex items-center space-x-4 overflow-x-auto border-b border-gray-200 pb-3 pt-2 dark:border-gray-700">
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="mt-3">
          <TimelineShimmer className="lg:!grid-cols-4" />
        </div>
      </div>
    </>
  )
}

export default ProfilePageShimmer
