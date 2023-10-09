import React, { useMemo } from 'react'

const LatestBytesShimmer = () => {
  const cards = useMemo(() => Array(15).fill(1), [])
  return (
    <div className="animate-pulse">
      <div className="no-scrollbar relative mb-3 flex items-start space-x-4 overflow-x-auto scroll-smooth">
        {cards.map((i, idx) => (
          <div key={`${i}_${idx}`} className="space-y-1.5">
            <div className="rounded-large ultrawide:h-[400px] ultrawide:w-[260px] aspect-[9/16] h-[350px] w-[220px] bg-gray-300 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestBytesShimmer
