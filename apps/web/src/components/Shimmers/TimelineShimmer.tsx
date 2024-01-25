import { tw } from '@tape.xyz/browser'
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
      className={tw(
        'ultrawide:grid-cols-6 desktop:grid-cols-4 tablet:grid-cols-3 grid-col-1 grid gap-x-4 gap-y-2 md:gap-y-6',
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
