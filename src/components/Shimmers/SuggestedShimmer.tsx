import React from 'react'

const SuggestedShimmer = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex space-x-2 animate-pulse">
        <div className="h-24 bg-gray-300 rounded-lg w-44 dark:bg-gray-700" />
        <div className="flex flex-col flex-1 space-y-2">
          <div className="w-full h-3 bg-gray-300 rounded dark:bg-gray-700" />
          <div className="w-1/2 h-2 bg-gray-300 rounded dark:bg-gray-700" />
          <div className="w-1/2 h-2 bg-gray-300 rounded dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default SuggestedShimmer
