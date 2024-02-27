import React from 'react'

const BubblesShimmer = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-shimmer flex -space-x-1.5">
        <span className="size-7 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="size-7 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="size-7 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="size-7 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
        <span className="size-7 rounded-full border bg-gray-200 dark:border-gray-700/80 dark:bg-gray-800" />
      </div>
    </div>
  )
}

export default BubblesShimmer
