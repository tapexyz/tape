import React from 'react'

const VideoCardShimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex flex-col space-x-2 animate-pulse">
        <div className="bg-gray-300 rounded-xl aspect-w-16 aspect-h-9 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default VideoCardShimmer
