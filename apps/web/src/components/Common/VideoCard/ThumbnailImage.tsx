import type { AnyPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { useAverageColor } from '@tape.xyz/browser'
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
import clsx from 'clsx'
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
      alt="thumbnail"
      className={clsx(
        'h-full w-full rounded-lg bg-gray-100 object-center dark:bg-gray-900 lg:h-full lg:w-full',
        isBytesVideo ? 'object-contain' : 'object-cover'
      )}
      draggable={false}
      height={600}
      onError={({ currentTarget }) => {
        currentTarget.src = FALLBACK_THUMBNAIL_URL
      }}
      src={imageCdn(thumbnailUrl, isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL')}
      style={{
        backgroundColor: backgroundColor && `${backgroundColor}95`
      }}
      width={1000}
    />
  )
}

export default ThumbnailImage
