import IsVerified from '@components/Common/IsVerified'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { STATIC_ASSETS } from '@utils/constants'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { getValueFromTraitType } from '@utils/functions/getFromAttributes'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { useState } from 'react'
import { Attribute } from 'src/types'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

const SuggestedVideoCard = ({ video }: { video: LenstubePublication }) => {
  const [showReport, setShowReport] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="flex justify-between group">
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
                  'thumbnail'
                )}
                alt="thumbnail"
                draggable={false}
                className="object-cover object-center h-20 w-36"
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
            <div className="flex w-full items-start overflow-hidden justify-between space-x-1.5">
              <Link
                href={`/watch/${video.id}`}
                className="overflow-hidden text-sm font-medium line-clamp-1"
              >
                <span className="flex line-clamp-2">
                  {video.metadata?.name}
                </span>
              </Link>
            </div>
            <div className="truncate">
              <Link
                href={`/${video.profile?.handle}`}
                className="text-xs truncate hover:opacity-100 opacity-70"
              >
                <div className="flex items-center space-x-0.5">
                  <span>{video?.profile?.handle}</span>
                  <IsVerified id={video?.profile.id} size="xs" />
                </div>
              </Link>
            </div>
            <div className="flex truncate items-center text-[11px] opacity-70 mt-0.5">
              <span className="whitespace-nowrap">
                {video.stats?.totalUpvotes} likes
              </span>
              <span className="middot" />
              <span>{dayjs(new Date(video.createdAt)).fromNow()}</span>
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
