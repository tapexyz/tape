import { useAverageColor } from '@lenstube/browser'
import {
  FALLBACK_COVER_URL,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@lenstube/constants'
import {
  getIsSensitiveContent,
  getPublication,
  getThumbnailUrl,
  imageCdn
} from '@lenstube/generic'
import type { AnyPublication } from '@lenstube/lens'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: AnyPublication
}

const ThumbnailImage: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video)

  const isSensitiveContent = getIsSensitiveContent(
    targetPublication.metadata,
    video.id
  )
  const isBytesVideo =
    targetPublication.publishedOn?.id === LENSTUBE_BYTES_APP_ID

  const thumbnailUrl = isSensitiveContent
    ? `${STATIC_ASSETS}/images/sensor-blur.png`
    : getThumbnailUrl(targetPublication, true)
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <img
      src={imageCdn(thumbnailUrl, isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL')}
      className={clsx(
        'h-full w-full rounded-md bg-gray-100 object-center transition-all duration-300 hover:scale-105 dark:bg-gray-900 lg:h-full lg:w-full',
        isBytesVideo ? 'object-contain' : 'object-cover'
      )}
      style={{
        backgroundColor: backgroundColor && `${backgroundColor}95`
      }}
      alt="thumbnail"
      draggable={false}
      onError={({ currentTarget }) => {
        currentTarget.src = FALLBACK_COVER_URL
      }}
    />
  )
}

export default ThumbnailImage
