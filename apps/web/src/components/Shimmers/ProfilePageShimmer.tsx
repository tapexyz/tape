import React from 'react'

import ButtonShimmer from './ButtonShimmer'
import TimelineShimmer from './TimelineShimmer'

const ProfilePageShimmer = () => {
  return (
    <>
      <div className="animate-shimmer flex flex-col">
        <div className="ultrawide:h-[25vh] h-44 bg-gray-100 md:h-[20vw] dark:bg-gray-800" />
        <div className="mx-auto flex w-full max-w-screen-xl items-center space-x-4 px-2 md:pt-1 xl:px-0">
          <div className="flex w-full py-4">
            <div className="flex flex-1 flex-col space-y-2">
              <div className="col-span-2 h-5 rounded bg-gray-200 md:w-1/4 dark:bg-gray-800" />
              <div className="col-span-2 h-4 rounded bg-gray-200 md:w-1/6 dark:bg-gray-800" />
            </div>
            <div className="hidden gap-3 md:flex md:flex-col md:items-end">
              <ButtonShimmer />
              <div className="col-span-2 h-4 w-44 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl px-2 xl:px-0">
        <div className="no-scrollbar flex items-center space-x-4 overflow-x-auto border-b border-gray-200 pb-3 pt-2 dark:border-gray-700">
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-24 flex-none rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="mt-3">
          <TimelineShimmer count={4} className="lg:!grid-cols-4" />
        </div>
      </div>
    </>
  )
}

export default ProfilePageShimmer
