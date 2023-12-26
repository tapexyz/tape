import { THUMBNAIL_GENERATE_COUNT } from '@components/Create/ChooseThumbnail'
import { AspectRatio } from '@radix-ui/themes'
import React, { useMemo } from 'react'

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), [])

  return (
    <>
      {thumbnails.map((e, i) => (
        <AspectRatio
          ratio={16 / 9}
          key={`${e}_${i}`}
          className="w-full animate-pulse rounded-lg"
        >
          <div className="h-full rounded-lg bg-gray-200 dark:bg-gray-800" />
        </AspectRatio>
      ))}
    </>
  )
}

export default ThumbnailsShimmer
