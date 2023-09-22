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
    : getThumbnailUrl(targetPublication)
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <img
      src={
        thumbnailUrl
          ? imageCdn(thumbnailUrl, isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL')
          : ''
      }
      className={clsx(
        'h-full w-full rounded-xl bg-gray-100 object-center dark:bg-gray-900 lg:h-full lg:w-full',
        isBytesVideo ? 'object-contain' : 'object-cover'
      )}
      style={{
        backgroundColor: backgroundColor && `${backgroundColor}95`
      }}
      alt="thumbnail"
      draggable={false}
      onError={({ currentTarget }) => {
        currentTarget.src = FALLBACK_COVER_URL
        // const thumbnail = await generateVideoThumbnail(
        //   getPublicationMediaUrl(video)
        // )
        // currentTarget.onerror = null
        // if (thumbnail?.includes('base64')) {
        //   currentTarget.src = thumbnail
        // }
      }}
    />
  )
}

export default ThumbnailImage
