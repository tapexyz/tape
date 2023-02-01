import { THUMBNAIL_GENERATE_COUNT } from '@components/Upload/ChooseThumbnail'
import React, { useMemo } from 'react'

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), [])

  return (
    <>
      {thumbnails.map((e, i) => (
        <div key={`${e}_${i}`} className="h-16 w-full animate-pulse rounded-lg">
          <div className="h-16 rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      ))}
    </>
  )
}

export default ThumbnailsShimmer
