import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import type { MirrorablePublication } from '@lenstube/lens'
import { AspectRatio, Flex, Separator } from '@radix-ui/themes'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

import HoverableProfile from '../HoverableProfile'
import CommentOutline from '../Icons/CommentOutline'
import HeartOutline from '../Icons/HeartOutline'
import ReportModal from './ReportModal'
import ShareModal from './ShareModal'
import ThumbnailImage from './ThumbnailImage'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

type Props = {
  video: MirrorablePublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const isBytes = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID

  const href = isBytes ? `/bytes/${video.id}` : `/watch/${video.id}`

  return (
    <div className="group" data-testid="video-card">
      {video.isHidden ? (
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
            <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
              <ThumbnailImage video={video} />
              <ThumbnailOverlays video={video} />
            </AspectRatio>
          </Link>
          <div className="py-2">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
              <Link
                className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words font-semibold"
                href={href}
                title={video.metadata.marketplace?.name ?? ''}
                data-testid="video-card-title"
              >
                {video.metadata.marketplace?.name}
              </Link>
              <VideoOptions
                video={video}
                setShowShare={setShowShare}
                setShowReport={setShowReport}
              />
            </div>

            <Flex align="center" gap="2">
              <HoverableProfile profile={video.by} />
              <Separator orientation="vertical" />
              <div className="flex items-center overflow-hidden text-xs opacity-80">
                <Flex align="center" gap="1">
                  <HeartOutline className="h-3 w-3" />
                  {video.stats?.reactions}
                </Flex>
                <span className="middot" />
                <Flex align="center" gap="1">
                  <CommentOutline className="h-3 w-3" />
                  {video.stats?.comments}
                </Flex>
              </div>
            </Flex>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoCard
