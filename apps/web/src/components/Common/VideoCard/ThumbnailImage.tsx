import clsx from 'clsx'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React from 'react'
import { FALLBACK_COVER_URL, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from 'utils'
import { generateVideoThumbnail } from 'utils/functions/generateVideoThumbnails'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import useAverageColor from 'utils/hooks/useAverageColor'

type Props = {
  video: Publication
}

const ThumbnailImage: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID

  const thumbnailUrl = isSensitiveContent
    ? `${STATIC_ASSETS}/images/sensor-blur.png`
    : getThumbnailUrl(video)
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <img
      src={
        thumbnailUrl
          ? imageCdn(thumbnailUrl, isBytesVideo ? 'thumbnail_v' : 'thumbnail')
          : ''
      }
      className={clsx(
        'h-full w-full bg-gray-100 object-center dark:bg-gray-900 md:rounded-xl lg:h-full lg:w-full',
        isBytesVideo ? 'object-contain' : 'object-cover'
      )}
      style={{
        backgroundColor: backgroundColor && `${backgroundColor}95`
      }}
      alt="thumbnail"
      draggable={false}
      onError={async ({ currentTarget }) => {
        currentTarget.src = FALLBACK_COVER_URL
        const thumbnail = await generateVideoThumbnail(
          getPublicationMediaUrl(video)
        )
        currentTarget.onerror = null
        currentTarget.src = thumbnail
      }}
    />
  )
}

export default ThumbnailImage
