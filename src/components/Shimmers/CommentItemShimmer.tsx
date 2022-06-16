import React from 'react'

const CommentItemShimmer = () => {
  return (
    <div className="flex flex-col space-x-2 animate-pulse">
      <div className="flex py-3 space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded-xl dark:bg-gray-700"></div>
        <div className="flex-1 py-1 space-y-2">
          <span className="space-y-2">
            <div className="w-1/4 h-2 bg-gray-300 rounded dark:bg-gray-700"></div>
            <div className="h-2 bg-gray-300 rounded dark:bg-gray-700"></div>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommentItemShimmer
