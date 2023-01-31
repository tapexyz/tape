import clsx from 'clsx'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Analytics, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils'
import { getRelativeTime } from 'utils/functions/formatTime'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import useAverageColor from 'utils/hooks/useAverageColor'

import IsVerified from '../IsVerified'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

type Props = {
  video: Publication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID

  const thumbnailUrl = imageCdn(
    isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : getThumbnailUrl(video),
    isBytesVideo ? 'thumbnail_v' : 'thumbnail'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <div onClick={() => Analytics.track(TRACK.CLICK_VIDEO)} className="group">
      {video.hidden ? (
        <div className="grid h-full place-items-center">
          <span className="text-xs">Video Hidden by User</span>
        </div>
      ) : (
        <>
          <ShareModal
            video={video}
            show={showShare}
            setShowShare={setShowShare}
          />
          <ReportModal
            video={video}
            show={showReport}
            setShowReport={setShowReport}
          />
          <Link href={`/watch/${video.id}`}>
            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
              <img
                className={clsx(
                  'h-full w-full bg-gray-100 object-center dark:bg-gray-900 md:rounded-xl lg:h-full lg:w-full',
                  isBytesVideo ? 'object-contain' : 'object-cover'
                )}
                src={thumbnailUrl}
                style={{
                  backgroundColor: backgroundColor && `${backgroundColor}95`
                }}
                alt="thumbnail"
                draggable={false}
              />
              <ThumbnailOverlays video={video} />
            </div>
          </Link>
          <div className="py-2">
            <div className="flex items-start space-x-2.5">
              <Link href={`/watch/${video.id}`} className="mt-0.5 flex-none">
                <img
                  className="h-8 w-8 rounded-full"
                  src={getProfilePicture(video.profile)}
                  alt={video.profile?.handle}
                  draggable={false}
                />
              </Link>
              <div className="grid flex-1">
                <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
                  <Link
                    href={`/watch/${video.id}`}
                    className="line-clamp-2 break-words text-sm font-semibold"
                  >
                    {video.metadata?.name}
                  </Link>
                  <VideoOptions
                    video={video}
                    setShowShare={setShowShare}
                    setShowReport={setShowReport}
                  />
                </div>
                <Link
                  href={`/channel/${video.profile?.handle}`}
                  className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70 hover:opacity-100"
                >
                  <span>{video.profile?.handle}</span>
                  <IsVerified id={video.profile?.id} size="xs" />
                </Link>
                <div className="flex items-center overflow-hidden text-xs opacity-70">
                  <span className="whitespace-nowrap">
                    {video.stats?.totalUpvotes} likes
                  </span>
                  <span className="middot" />
                  {video.createdAt && (
                    <span className="whitespace-nowrap">
                      {getRelativeTime(video.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoCard
