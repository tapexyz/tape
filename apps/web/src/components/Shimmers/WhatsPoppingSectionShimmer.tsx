import React, { useMemo } from 'react'

const WhatsPoppingSectionShimmer = () => {
  const cards = useMemo(() => Array(7).fill(1), [])

  return (
    <div className="relative mb-3 flex items-start space-x-4">
      {cards.map((i, idx) => (
        <div className="w-72 rounded-xl" key={`${i}_${idx}`}>
          <div className="animate-shimmer flex flex-col space-x-2">
            <div className="aspect-w-16 aspect-h-9 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="flex space-x-2 py-3">
              <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2 py-1">
                <span className="space-y-2">
                  <div className="h-2 rounded bg-gray-200 dark:bg-gray-800" />
                </span>
                <div>
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 h-2 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WhatsPoppingSectionShimmer
