import React from 'react'

import { AudioCardShimmer } from './AudioCardShimmer'
import ButtonShimmer from './ButtonShimmer'
import { CardShimmer } from './VideoCardShimmer'

export const BangersBubbles = () => {
  return (
    <div className="flex items-center -space-x-2">
      <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
    </div>
  )
}

const BangersShimmer = () => {
  return (
    <div className="ultrawide:space-y-8 animate-shimmer space-y-6 p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <ButtonShimmer className="h-8" />
        </div>
        <CardShimmer />
        <div className="flex space-x-2">
          <ButtonShimmer className="h-6" />
          <ButtonShimmer className="h-6" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <ButtonShimmer className="h-8" />
        </div>
        <AudioCardShimmer />
        <div className="flex space-x-2">
          <ButtonShimmer className="h-6" />
          <ButtonShimmer className="h-6" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="tape-border size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
          <ButtonShimmer className="h-8" />
        </div>
        <CardShimmer />
        <div className="flex space-x-2">
          <ButtonShimmer className="h-6" />
          <ButtonShimmer className="h-6" />
        </div>
      </div>
    </div>
  )
}

export default BangersShimmer
