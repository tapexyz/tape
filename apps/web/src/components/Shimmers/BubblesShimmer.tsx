import React from 'react'

const BubblesShimmer = () => {
  return (
    <div className="mt-3 flex items-center space-x-2">
      <div className="flex animate-pulse -space-x-1.5">
        <span className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="h-6 w-6 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
      </div>
      <div className="h-4 w-44 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  )
}

export default BubblesShimmer
