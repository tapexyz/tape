import { tw } from '@tape.xyz/browser'
import React, { useMemo } from 'react'

const AudioTimelineShimmer = ({
  className,
  count = 8
}: {
  className?: string
  count?: number
}) => {
  const cards = useMemo(() => Array(count).fill(1), [count])
  return (
    <div
      className={tw(
        'ultrawide:grid-cols-6 desktop:grid-cols-4 tablet:grid-cols-3 grid-col-1 grid gap-x-4 gap-y-2 md:gap-y-6',
        className
      )}
    >
      {cards.map((i, idx) => (
        <div
          key={`${i}_${idx}`}
          className="rounded-small animate-shimmer aspect-[1/1] w-full bg-gray-200 dark:bg-gray-800"
        />
      ))}
    </div>
  )
}

export default AudioTimelineShimmer
