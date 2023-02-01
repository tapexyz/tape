import InterweaveContent from '@components/Common/InterweaveContent'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
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
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
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

  const pinnedPublication = data?.publication as Publication
  const isBytesVideo = pinnedPublication?.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(
    pinnedPublication?.metadata,
    pinnedPublication?.id
  )

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (error || !isWatchable(pinnedPublication)) {
    return null
  }

  return (
    <div className="mb-6 grid grid-cols-3 overflow-hidden border-b border-gray-300 pb-6 dark:border-gray-700">
      <div className="overflow-hidden md:rounded-xl">
        <VideoPlayer
          permanentUrl={getPublicationMediaUrl(pinnedPublication)}
          posterUrl={imageCdn(
            sanitizeIpfsUrl(getThumbnailUrl(pinnedPublication)),
            isBytesVideo ? 'thumbnail_v' : 'thumbnail'
          )}
          isSensitiveContent={isSensitiveContent}
          options={{ autoPlay: true, loop: false }}
        />
      </div>
      <div className="flex flex-col justify-between space-y-3 px-2 md:px-5 lg:col-span-2">
        <div className="space-y-4">
          <Link
            className="inline break-words text-lg font-medium"
            href={`/watch/${pinnedPublication.id}`}
            title={pinnedPublication.metadata?.name ?? ''}
          >
            {pinnedPublication.metadata?.name}
          </Link>
          <div className="flex items-center overflow-hidden opacity-70">
            <span className="whitespace-nowrap">
              {pinnedPublication.stats?.totalUpvotes} likes
            </span>
            <span className="middot" />
            {pinnedPublication.createdAt && (
              <span className="whitespace-nowrap">
                {getRelativeTime(pinnedPublication.createdAt)}
              </span>
            )}
          </div>
          <p className="line-clamp-6 text-sm">
            <InterweaveContent
              content={pinnedPublication.metadata?.description}
            />
          </p>
        </div>
        <Link
          className="text-xs font-semibold text-indigo-500"
          href={`/watch/${pinnedPublication.id}`}
        >
          View more
        </Link>
      </div>
    </div>
  )
}

export default PinnedVideo
