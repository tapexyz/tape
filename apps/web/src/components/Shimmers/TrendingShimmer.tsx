import clsx from 'clsx'
import React, { useMemo } from 'react'

const TrendingShimmer = () => {
  const cards = useMemo(() => Array(15).fill(1), [])
  return (
    <div className="mb-4 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-24 rounded-xl">
            <div className="rounded-lg bg-gray-300 px-4 py-3 dark:bg-gray-700" />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
      <div>
        <div className="no-scrollbar relative mb-3 flex items-start space-x-2 overflow-x-auto scroll-smooth">
          {cards.map((i, idx) => (
            <div
              key={`${i}_${idx}`}
              className={clsx(
                'h-[280px] rounded-xl bg-gray-300 dark:bg-gray-700',
                idx % 2 === 0 ? 'aspect-[16/9]' : 'aspect-[9/16]'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingShimmer
