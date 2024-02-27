import { tw } from '@tape.xyz/browser'
import React from 'react'

export const CardShimmer = ({ rounded = true }) => {
  return (
    <div className={tw('w-full', rounded && 'rounded-xl')}>
      <div className="animate-shimmer flex flex-col space-x-2">
        <div
          className={tw(
            'aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800',
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
      <div className="animate-shimmer flex flex-col">
        <div className="aspect-w-16 aspect-h-9 rounded-medium bg-gray-200 dark:bg-gray-800" />
        <div className="flex space-x-2 py-2">
          <div className="size-8 flex-none rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex w-full flex-col space-y-2">
            <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardShimmer
