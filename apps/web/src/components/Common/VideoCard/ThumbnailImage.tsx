import { tw, useAverageColor } from '@tape.xyz/browser'
import {
  FALLBACK_THUMBNAIL_URL,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@tape.xyz/constants'
import {
  getIsSensitiveContent,
  getPublication,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
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
    ? `${STATIC_ASSETS}/images/sensor-blur.webp`
    : getThumbnailUrl(targetPublication.metadata, true)
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <img
      src={imageCdn(thumbnailUrl, isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL')}
      className={tw(
        'h-full w-full rounded-lg bg-gray-100 object-center lg:h-full lg:w-full dark:bg-gray-900',
        isBytesVideo ? 'object-contain' : 'object-cover'
      )}
      style={{
        backgroundColor: backgroundColor && `${backgroundColor}95`
      }}
      width={1000}
      height={600}
      alt="thumbnail"
      draggable={false}
      onError={({ currentTarget }) => {
        currentTarget.src = FALLBACK_THUMBNAIL_URL
      }}
    />
  )
}

export default ThumbnailImage
