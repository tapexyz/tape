import InterweaveContent from '@components/Common/InterweaveContent'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  getCategoryName,
  getIsSensitiveContent,
  getPublicationData,
  getPublicationMediaUrl,
  getShouldUploadVideo,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { PrimaryPublication, VideoMetadataV3 } from '@tape.xyz/lens'
import {
  Badge,
  ChevronDownOutline,
  ChevronUpOutline,
  VideoPlayer
} from '@tape.xyz/ui'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import PublicationActions from '../Common/Publication/PublicationActions'
import VideoMeta from './VideoMeta'

type Props = {
  video: PrimaryPublication
}

const Video: FC<Props> = ({ video }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const { activeProfile } = useProfileStore()
  const metadata = video.metadata as VideoMetadataV3

  useEffect(() => {
    if (metadata?.content?.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [metadata?.content])

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const videoUrl = getPublicationMediaUrl(video.metadata)

  const refCallback = (ref: HTMLMediaElement) => {
    if (ref) {
      ref.autoplay = true
    }
  }

  return (
    <div>
      <div className="rounded-large overflow-hidden">
        <VideoPlayer
          address={activeProfile?.ownedBy.address}
          refCallback={refCallback}
          currentTime={videoWatchTime}
          url={videoUrl}
          posterUrl={thumbnailUrl}
          options={{
            loadingSpinner: true,
            isCurrentlyShown: true
          }}
          isSensitiveContent={isSensitiveContent}
          shouldUpload={getShouldUploadVideo(video)}
        />
      </div>
      <div>
        <h1 className="mt-4 line-clamp-2 font-bold md:text-xl">
          <InterweaveContent
            content={getPublicationData(video.metadata)?.title || ''}
          />
        </h1>
        <VideoMeta video={video} />
        <PublicationActions publication={video} />

        <hr className="my-4 border-[0.5px] border-gray-200 dark:border-gray-800" />
        <div className="flex flex-1 flex-col overflow-hidden break-words">
          {getPublicationData(metadata)?.content ? (
            <p className={clsx({ 'line-clamp-3': clamped })}>
              <InterweaveContent
                content={getPublicationData(metadata)?.content || ''}
              />
            </p>
          ) : null}
          {showMore && (
            <div className="mt-3 inline-flex">
              <button
                type="button"
                onClick={() => setClamped(!clamped)}
                className="flex items-center text-sm opacity-80 outline-none hover:opacity-100"
              >
                {clamped ? (
                  <>
                    Show more <ChevronDownOutline className="ml-1 size-3" />
                  </>
                ) : (
                  <>
                    Show less <ChevronUpOutline className="ml-1 size-3" />
                  </>
                )}
              </button>
            </div>
          )}
          <div className="mt-3 flex items-center">
            {video?.metadata?.tags && (
              <Link href={`/explore/${video.metadata.tags[0]}`}>
                <Badge>{getCategoryName(video.metadata.tags[0])}</Badge>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Video)
