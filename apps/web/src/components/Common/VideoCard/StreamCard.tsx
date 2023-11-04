import { getShortHandTime } from '@lib/formatTime'
import { AspectRatio, Avatar, Badge, Flex, Text } from '@radix-ui/themes'
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getPublicationData,
  getRandomProfilePicture
} from '@tape.xyz/generic'
import type { LiveStreamMetadataV3, PrimaryPublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import HoverableProfile from '../HoverableProfile'
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
    <div className="ultrawide:w-[23rem] group w-80">
      <Link href={href}>
        <AspectRatio
          ratio={16 / 9}
          className="rounded-medium tape-border relative overflow-hidden"
        >
          <ThumbnailImage video={stream} />
          <div className="absolute bottom-2 right-2">
            <Badge size="2" color="red">
              <Text weight="bold">Live</Text>
            </Badge>
          </div>
        </AspectRatio>
      </Link>
      <div className="py-2">
        <Flex gap="2">
          <Avatar
            src={getProfilePicture(stream.by, 'AVATAR')}
            size="1"
            radius="full"
            fallback={getRandomProfilePicture(stream.by.ownedBy.address)}
            alt={getProfile(stream.by).displayName}
          />

          <Flex direction="column" justify="between" width="100%">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <div className="flex items-center space-x-2">
                <Link
                  className="line-clamp-2 break-words font-bold"
                  href={href}
                >
                  {getPublicationData(metadata)?.title}
                </Link>
              </div>
              <div className="flex pr-1 pt-1">
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
              <span>{getShortHandTime(stream.createdAt)}</span>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default StreamCard
