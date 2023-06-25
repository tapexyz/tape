import type { Publication } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { LENSTUBE_BYTES_APP_ID } from 'utils'
import { getRelativeTime } from 'utils/functions/formatTime'
import getLensHandle from 'utils/functions/getLensHandle'
import getProfilePicture from 'utils/functions/getProfilePicture'

import IsVerified from '../IsVerified'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import ThumbnailImage from './ThumbnailImage'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

type Props = {
  video: Publication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const isBytes = video.appId === LENSTUBE_BYTES_APP_ID

  const href = isBytes ? `/bytes/${video.id}` : `/watch/${video.id}`

  return (
    <div className="group" data-testid="video-card">
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
          <Link href={href}>
            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
              <ThumbnailImage video={video} />
              <ThumbnailOverlays video={video} />
            </div>
          </Link>
          <div className="py-2">
            <div className="flex items-start space-x-2.5">
              <Link
                href={`/channel/${getLensHandle(video.profile?.handle)}`}
                className="mt-0.5 flex-none"
              >
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
                    className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words text-sm font-semibold"
                    href={href}
                    title={video.metadata?.name ?? ''}
                    data-testid="video-card-title"
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
                  data-testid="video-card-channel"
                >
                  <span>{video.profile?.handle}</span>
                  <IsVerified id={video.profile?.id} size="xs" />
                </Link>
                <div className="flex items-center overflow-hidden text-xs opacity-70">
                  <span className="whitespace-nowrap">
                    {video.stats?.totalUpvotes} <Trans>likes</Trans>
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
