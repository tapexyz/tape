import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import { Trans } from '@lingui/macro'
import type { Publication } from 'lens'
import { usePublicationDetailsQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { LENSTUBE_BYTES_APP_ID } from 'utils'
import { getRelativeTime } from 'utils/functions/formatTime'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import isWatchable from 'utils/functions/isWatchable'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import VideoPlayer from 'web-ui/VideoPlayer'

type Props = {
  id: string
}

const PinnedVideo: FC<Props> = ({ id }) => {
  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id }
    },
    skip: !id
  })

  const publication = data?.publication as Publication
  const pinnedPublication =
    publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (error || !pinnedPublication || !isWatchable(pinnedPublication)) {
    return null
  }

  const isBytesVideo = pinnedPublication?.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(
    pinnedPublication?.metadata,
    pinnedPublication?.id
  )
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(pinnedPublication, true)),
    isBytesVideo ? 'thumbnail_v' : 'thumbnail'
  )

  return (
    <div className="mb-6 mt-2 grid grid-cols-3 overflow-hidden border-b border-gray-300 pb-6 dark:border-gray-700 md:space-x-5">
      <div className="overflow-hidden md:rounded-xl">
        <VideoPlayer
          permanentUrl={getPublicationMediaUrl(pinnedPublication)}
          posterUrl={thumbnailUrl}
          isSensitiveContent={isSensitiveContent}
          options={{
            autoPlay: true,
            loop: false,
            loadingSpinner: true,
            isCurrentlyShown: true
          }}
        />
      </div>
      <div className="flex flex-col justify-between px-2 lg:col-span-2">
        <div className="space-y-3">
          <Link
            className="inline break-words text-lg font-medium"
            href={`/watch/${pinnedPublication.id}`}
            title={pinnedPublication.metadata?.name ?? ''}
          >
            {pinnedPublication.metadata?.name}
          </Link>
          <div className="flex items-center overflow-hidden opacity-70">
            <span className="whitespace-nowrap">
              {pinnedPublication.stats?.totalUpvotes} <Trans>likes</Trans>
            </span>
            <span className="middot" />
            {pinnedPublication.createdAt && (
              <span className="whitespace-nowrap">
                {getRelativeTime(pinnedPublication.createdAt)}
              </span>
            )}
          </div>
          <p className="line-clamp-6 text-sm">
            {pinnedPublication.metadata?.description}
          </p>
        </div>
        <Link
          className="text-xs font-semibold text-indigo-500"
          href={`/watch/${pinnedPublication.id}`}
        >
          <Trans>View more</Trans>
        </Link>
      </div>
    </div>
  )
}

export default PinnedVideo
