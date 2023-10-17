import { getShortHandTime } from '@lib/formatTime'
import { AspectRatio, Avatar, Badge, Flex } from '@radix-ui/themes'
import {
  formatNumber,
  getProfilePicture,
  getRandomProfilePicture
} from '@tape.xyz/generic'
import type { LiveStreamMetadataV3, PrimaryPublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import HoverableProfile from '../HoverableProfile'
import CommentOutline from '../Icons/CommentOutline'
import HeartOutline from '../Icons/HeartOutline'
import ThumbnailImage from './ThumbnailImage'
import VideoOptions from './VideoOptions'

type Props = {
  stream: PrimaryPublication
}

const StreamCard: FC<Props> = ({ stream }) => {
  const metadata = stream.metadata as LiveStreamMetadataV3
  const href = `/watch/${stream.id}`

  return (
    <div className="group w-80">
      <Link href={href}>
        <AspectRatio
          ratio={16 / 9}
          className="rounded-medium tape-border relative overflow-hidden"
        >
          <ThumbnailImage video={stream} />
          <div className="absolute bottom-2 right-2">
            <Badge size="2" color="red">
              Live
            </Badge>
          </div>
        </AspectRatio>
      </Link>
      <div className="py-2">
        <Flex gap="2">
          <HoverableProfile profile={stream.by}>
            <Avatar
              src={getProfilePicture(stream.by)}
              size="1"
              radius="full"
              fallback={getRandomProfilePicture(stream.by.ownedBy.address)}
            />
          </HoverableProfile>

          <Flex direction="column" justify="between" width="100%">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <div className="flex items-center space-x-2">
                <Link
                  className="ultrawide:break-all line-clamp-1 break-words font-semibold"
                  href={href}
                >
                  {metadata.marketplace?.name}
                </Link>
              </div>
              <div className="pr-2 pt-1">
                <VideoOptions video={stream} />
              </div>
            </div>

            <Flex align="center" className="text-xs">
              <HoverableProfile profile={stream.by} />
              <span className="middot" />
              <Flex align="center" gap="1">
                <HeartOutline className="h-3 w-3" />
                {formatNumber(stream.stats?.reactions)}
              </Flex>
              <span className="middot" />
              <Flex align="center" gap="1">
                <CommentOutline className="h-3 w-3" />
                {formatNumber(stream.stats?.comments)}
              </Flex>
              <span className="middot" />
              <span>{getShortHandTime(stream.createdAt)}</span>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default StreamCard
