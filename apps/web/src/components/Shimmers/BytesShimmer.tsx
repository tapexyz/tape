import React, { useMemo } from 'react'

const BytesShimmer = () => {
  const cards = useMemo(() => Array(10).fill(1), [])
  return (
    <>
      <div className="animate-pulse mb-4">
        <div className="flex justify-between mb-4 items-center">
          <div className="flex space-x-2 items-center">
            <div className="w-24 rounded-xl">
              <div className="px-4 py-3 bg-gray-300 rounded-lg dark:bg-gray-700" />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
        <div>
          <div className="flex scroll-smooth relative no-scrollbar items-start overflow-x-auto space-x-4 mb-3">
            {cards.map((i, idx) => (
              <div key={`${i}_${idx}`} className="space-y-1.5">
                <div className="aspect-[9/16] h-[300px] bg-gray-300 dark:bg-gray-700 rounded-xl" />
                <div className="py-1 bg-gray-300 rounded-lg dark:bg-gray-700" />
                <div className="py-1 w-20 bg-gray-300 rounded-lg dark:bg-gray-700" />
                <div className="flex items-center space-x-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <div className="py-1 w-20 bg-gray-300 rounded-lg dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="my-8 border-theme dark:border-gray-700 border-opacity-10" />
    </>
  )
}

export default BytesShimmer
