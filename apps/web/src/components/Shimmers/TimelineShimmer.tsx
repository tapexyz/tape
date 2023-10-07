import clsx from 'clsx'
import React, { useMemo } from 'react'

import VideoCardShimmer from './VideoCardShimmer'

const TimelineShimmer = ({
  className,
  count = 15
}: {
  className?: string
  count?: number
}) => {
  const cards = useMemo(() => Array(count).fill(1), [count])
  return (
    <div
      className={clsx(
        'laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8',
        className
      )}
    >
      {cards.map((i, idx) => (
        <VideoCardShimmer key={`${i}_${idx}`} />
      ))}
    </div>
  )
}

export default TimelineShimmer
