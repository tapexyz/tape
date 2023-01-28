import IsVerified from '@components/Common/IsVerified'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import clsx from 'clsx'
import type { Attribute, Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Analytics, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils'
import { getRelativeTime, getTimeFromSeconds } from 'utils/functions/formatTime'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'

type Props = {
  video: Publication
}

const SuggestedVideoCard: FC<Props> = ({ video }) => {
  const [showReport, setShowReport] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const isByteVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div
      onClick={() => Analytics.track(TRACK.CLICK_VIDEO)}
      className="flex justify-between group"
      role="button"
    >
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        video={video}
        show={showReport}
        setShowReport={setShowReport}
      />
      <div className="flex justify-between">
        <div className="flex-none overflow-hidden rounded-lg">
          <Link
            href={`/watch/${video.id}`}
            className="rounded-lg cursor-pointer"
          >
            <div className="relative">
              <img
                src={imageCdn(
                  isSensitiveContent
                    ? `${STATIC_ASSETS}/images/sensor-blur.png`
                    : getThumbnailUrl(video),
                  isByteVideo ? 'thumbnail_v' : 'thumbnail'
                )}
                alt="thumbnail"
                draggable={false}
                className={clsx(
                  'object-center h-20 w-36 dark:bg-gray-700 bg-gray-300',
                  isByteVideo ? 'object-contain' : 'object-cover'
                )}
              />
              {!isSensitiveContent && videoDuration ? (
                <div>
                  <span className="absolute bottom-1 right-1 text-[10px] px-1 text-white bg-black rounded">
                    {getTimeFromSeconds(videoDuration)}
                  </span>
                </div>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="px-2.5 overflow-hidden">
          <div className="flex flex-col items-start pb-1">
            <div className="grid break-words w-full overflow-hidden">
              <Link
                href={`/watch/${video.id}`}
                className="text-sm font-medium line-clamp-1"
              >
                <span className="flex line-clamp-2">
                  {video.metadata?.name}
                </span>
              </Link>
            </div>
            <div className="truncate">
              <Link
                href={`/channel/${video.profile?.handle}`}
                className="text-[13px] truncate hover:opacity-100 opacity-70"
              >
                <div className="flex items-center space-x-0.5">
                  <span>{video?.profile?.handle}</span>
                  <IsVerified id={video?.profile.id} size="xs" />
                </div>
              </Link>
            </div>
            <div className="flex truncate items-center text-xs opacity-70 mt-0.5">
              <span className="whitespace-nowrap">
                {video.stats?.totalUpvotes} likes
              </span>
              <span className="middot" />
              <span>{getRelativeTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <VideoOptions
        setShowReport={setShowReport}
        video={video}
        setShowShare={setShowShare}
      />
    </div>
  )
}

export default SuggestedVideoCard
