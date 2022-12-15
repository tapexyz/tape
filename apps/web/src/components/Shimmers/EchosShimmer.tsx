import React, { useMemo } from 'react'

export const CardShimmer = () => {
  return (
    <div className="flex flex-col p-2 bg-white rounded-xl h-full md:w-[220px] w-full dark:bg-gray-900">
      <div className="flex flex-col animate-pulse">
        <div className="w-full md:h-[220px] rounded-lg bg-gray-200" />
        <div className="mt-2 space-y-2">
          <div className="h-2 bg-gray-200 rounded-2xl" />
          <div className="h-3 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

const EchosShimmer = () => {
  const cards = useMemo(() => Array(24).fill(1), [])

  return (
    <div className="grid max-w-[100rem] place-items-center mx-auto grid-cols-2 md:gap-3 gap-2 mt-4 desktop:grid-cols-6 ultrawide:grid-cols-7 md:grid-cols-3 laptop:grid-cols-4">
      {cards.map((i, idx) => (
        <CardShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default EchosShimmer
