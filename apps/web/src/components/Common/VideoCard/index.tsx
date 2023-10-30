import { getShortHandTime } from '@lib/formatTime'
import { AspectRatio, Avatar, Flex } from '@radix-ui/themes'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { PrimaryPublication, VideoMetadataV3 } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import HoverableProfile from '../HoverableProfile'
import HeartOutline from '../Icons/HeartOutline'
import ThumbnailImage from './ThumbnailImage'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

type Props = {
  video: PrimaryPublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const isBytes = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID

  const href = isBytes ? `/bytes/${video.id}` : `/watch/${video.id}`
  const metadata = video.metadata as VideoMetadataV3

  return (
    <div className="group">
      <Link href={href}>
        <AspectRatio
          ratio={16 / 9}
          className="rounded-medium tape-border relative overflow-hidden"
        >
          <ThumbnailImage video={video} />
          <ThumbnailOverlays video={video} />
        </AspectRatio>
      </Link>
      <div className="py-2">
        <Flex gap="2">
          <Avatar
            src={getProfilePicture(video.by)}
            size="2"
            radius="full"
            fallback={getProfile(video.by)?.displayName[0] ?? ';)'}
            alt={getProfile(video.by)?.displayName}
          />

          <Flex direction="column" justify="between" width="100%">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <div className="flex items-center space-x-2">
                <Link
                  className="ultrawide:break-all line-clamp-1 break-words font-bold"
                  href={href}
                >
                  {getPublicationData(metadata)?.title}
                </Link>
              </div>
              <div className="pr-2 pt-1">
                <VideoOptions video={video} />
              </div>
            </div>

            <Flex align="center" className="text-xs">
              <HoverableProfile profile={video.by} />
              <span className="middot" />
              <Flex align="center" gap="1">
                <HeartOutline className="h-3 w-3" />
                {formatNumber(video.stats?.reactions)}
              </Flex>
              <span className="middot" />
              <span>{getShortHandTime(video.createdAt)}</span>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default VideoCard
