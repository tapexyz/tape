import React from 'react'

const CommentItemShimmer = () => {
  return (
    <div className="flex animate-pulse flex-col space-x-2">
      <div className="flex space-x-2 py-3">
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex-1 space-y-2 py-1">
          <span className="space-y-2">
            <div className="flex space-x-2">
              <div className="h-2 w-1/6 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-2 w-10 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="h-2 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-2 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="flex space-x-2 pt-1">
              <div className="h-3 w-10 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-10 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommentItemShimmer
