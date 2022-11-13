import { Analytics, TRACK } from '@utils/analytics'
import { LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from '@utils/constants'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import type { LenstubePublication } from 'src/types/local'

import IsVerified from '../IsVerified'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const isByte = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : getThumbnailUrl(video),
    isByte ? 'thumbnail_v' : 'thumbnail'
  )

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
            <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
              <img
                src={thumbnailUrl}
                draggable={false}
                className={clsx(
                  'object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full',
                  isByte ? 'object-contain' : 'object-cover'
                )}
                alt="thumbnail"
              />
              <ThumbnailOverlays video={video} />
            </div>
          </Link>
          <div className="p-2">
            <div className="flex items-start space-x-2.5">
              <Link href={`/watch/${video.id}`} className="flex-none mt-0.5">
                <img
                  className="w-8 h-8 rounded-full"
                  src={getProfilePicture(video.profile)}
                  alt="channel picture"
                  draggable={false}
                />
              </Link>
              <div className="grid flex-1 pb-1">
                <div className="flex w-full items-start justify-between space-x-1.5 min-w-0">
                  <Link
                    href={`/watch/${video.id}`}
                    className="text-sm font-semibold line-clamp-2 break-words"
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
                  href={`/${video.profile?.handle}`}
                  className="flex w-fit items-center space-x-0.5 text-[13px] hover:opacity-100 opacity-70"
                >
                  <span>{video.profile?.handle}</span>
                  <IsVerified id={video.profile?.id} size="xs" />
                </Link>
                <div className="flex overflow-hidden items-center text-[11px] opacity-70">
                  <span className="whitespace-nowrap">
                    {video.stats?.totalUpvotes} likes
                  </span>
                  <span className="middot" />
                  {video.createdAt && (
                    <span className="whitespace-nowrap">
                      {dayjs(new Date(video.createdAt)).fromNow()}
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
