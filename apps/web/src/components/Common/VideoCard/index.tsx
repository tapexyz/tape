import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import { formatNumber } from '@lenstube/generic'
import type { MirrorablePublication, VideoMetadataV3 } from '@lenstube/lens'
import { AspectRatio, Flex, Separator } from '@radix-ui/themes'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import HoverableProfile from '../HoverableProfile'
import CommentOutline from '../Icons/CommentOutline'
import HeartOutline from '../Icons/HeartOutline'
import ThumbnailImage from './ThumbnailImage'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

type Props = {
  video: MirrorablePublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const isBytes = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID

  const href = isBytes ? `/bytes/${video.id}` : `/watch/${video.id}`
  const metadata = video.metadata as VideoMetadataV3

  return (
    <div className="group">
      {video.isHidden ? (
        <div className="grid h-full place-items-center">
          <span className="text-xs">Media deleted</span>
        </div>
      ) : (
        <>
          <Link href={href}>
            <AspectRatio
              ratio={16 / 9}
              className="relative overflow-hidden rounded-md"
            >
              <ThumbnailImage video={video} />
              <ThumbnailOverlays video={video} />
            </AspectRatio>
          </Link>
          <div className="py-2">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
              <Link
                className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words font-semibold"
                href={href}
                title={metadata.marketplace?.name ?? metadata.content}
              >
                {metadata.marketplace?.name}
              </Link>
              <div className="pt-2">
                <VideoOptions video={video} />
              </div>
            </div>

            <Flex align="center" gap="2">
              <HoverableProfile profile={video.by} />
              <Separator orientation="vertical" />
              <div className="flex items-center overflow-hidden text-xs opacity-80">
                <Flex align="center" gap="1">
                  <HeartOutline className="h-3 w-3" />
                  {formatNumber(video.stats?.reactions)}
                </Flex>
                <span className="middot" />
                <Flex align="center" gap="1">
                  <CommentOutline className="h-3 w-3" />
                  {formatNumber(video.stats?.comments)}
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
