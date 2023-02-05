import React, { useMemo } from 'react'

export const CardShimmer = () => {
  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-white p-2 dark:bg-gray-900 md:w-[220px]">
      <div className="flex animate-pulse flex-col">
        <div className="w-full rounded-lg bg-gray-300 dark:bg-gray-700 md:h-[220px]" />
        <div className="mt-2 space-y-2">
          <div className="h-2 rounded-2xl bg-gray-300 dark:bg-gray-700" />
          <div className="h-3 rounded-2xl bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

const EchosShimmer = () => {
  const cards = useMemo(() => Array(24).fill(1), [])

  return (
    <div className="desktop:grid-cols-6 ultrawide:grid-cols-7 laptop:grid-cols-4 mx-auto mt-4 grid max-w-[100rem] grid-cols-2 place-items-center gap-2 md:grid-cols-3 md:gap-3">
      {cards.map((i, idx) => (
        <CardShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default EchosShimmer
