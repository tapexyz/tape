import type { LiveStreamMetadataV3, PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { getShortHandTime } from '@lib/formatTime'
import { AspectRatio, Avatar, Badge, Flex, Text } from '@radix-ui/themes'
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getPublicationData,
  getRandomProfilePicture
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

import HoverableProfile from '../HoverableProfile'
import HeartOutline from '../Icons/HeartOutline'
import PublicationOptions from '../Publication/PublicationOptions'
import ThumbnailImage from './ThumbnailImage'

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
          className="rounded-medium tape-border relative overflow-hidden"
          ratio={16 / 9}
        >
          <ThumbnailImage video={stream} />
          <div className="absolute bottom-2 right-2">
            <Badge color="red" size="2">
              <Text weight="bold">Live</Text>
            </Badge>
          </div>
        </AspectRatio>
      </Link>
      <div className="py-2">
        <Flex gap="2">
          <Avatar
            alt={getProfile(stream.by).displayName}
            fallback={getRandomProfilePicture(stream.by.ownedBy.address)}
            radius="full"
            size="1"
            src={getProfilePicture(stream.by, 'AVATAR')}
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
                <PublicationOptions publication={stream} />
              </div>
            </div>

            <Flex align="center" className="text-xs">
              <HoverableProfile profile={stream.by} />
              <span className="middot" />
              <Flex align="center" gap="1">
                <HeartOutline className="size-3" />
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
