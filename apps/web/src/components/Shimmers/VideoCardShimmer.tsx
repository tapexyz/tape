import clsx from 'clsx'
import React from 'react'

export const CardShimmer = ({ rounded = true }) => {
  return (
    <div className={clsx('w-full', rounded && 'rounded-xl')}>
      <div className="flex animate-pulse flex-col space-x-2">
        <div
          className={clsx(
            'aspect-w-16 aspect-h-9 bg-gray-300 dark:bg-gray-700',
            rounded && 'rounded-large'
          )}
        />
      </div>
    </div>
  )
}

const VideoCardShimmer = () => {
  return (
    <div className="w-full rounded-xl">
      <div className="flex animate-pulse flex-col">
        <div className="aspect-w-16 aspect-h-9 rounded-medium bg-gray-300 dark:bg-gray-700" />
        <div className="flex space-x-2 py-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-full flex-1 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="h-3 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardShimmer
