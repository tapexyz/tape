import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import { usePublicationDetailsQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect } from 'react'
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
  const pinnedVideoId = usePersistStore((state) => state.pinnedVideoId)

  const { data, error, loading, refetch } = usePublicationDetailsQuery({
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

  // refetch on update own channel's pinned video
  useEffect(() => {
    refetch({
      request: { publicationId: pinnedVideoId }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedVideoId])

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (error || !isWatchable(pinnedPublication)) {
    return null
  }

  return (
    <div className="mb-5 grid grid-cols-3 overflow-hidden border-b border-gray-300 pb-3 dark:border-gray-700">
      <div className="overflow-hidden md:rounded-xl">
        <VideoPlayer
          permanentUrl={getPublicationMediaUrl(pinnedPublication)}
          posterUrl={imageCdn(
            sanitizeIpfsUrl(getThumbnailUrl(pinnedPublication)),
            isBytesVideo ? 'thumbnail_v' : 'thumbnail'
          )}
          isSensitiveContent={isSensitiveContent}
        />
      </div>
      <div className="flex flex-col justify-between space-y-3 px-2 md:px-5 lg:col-span-2">
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
        <p className="line-clamp-5 text-sm">
          {pinnedPublication.metadata?.description}
        </p>
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
