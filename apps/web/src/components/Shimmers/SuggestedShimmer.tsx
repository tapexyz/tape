import React from 'react'

const SuggestedShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex animate-pulse space-x-2">
        <div className="h-24 w-44 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="flex flex-1 flex-col space-y-2">
          <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default SuggestedShimmer
