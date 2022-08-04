import { THUMBNAIL_GENERATE_COUNT } from '@components/Upload/ChooseThumbnail'
import React, { useMemo } from 'react'

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(
    () => Array(THUMBNAIL_GENERATE_COUNT + 1).fill(1),
    []
  )

  return (
    <>
      {thumbnails.map((e, i) => (
        <div key={`${e}_${i}`} className="w-full h-16 rounded-lg animate-pulse">
          <div className="h-16 bg-gray-300 rounded-lg dark:bg-gray-700" />
        </div>
      ))}
    </>
  )
}

export default ThumbnailsShimmer
