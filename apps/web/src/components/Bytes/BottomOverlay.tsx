import Badge from '@components/Common/Badge'
import SubscribeActions from '@components/Common/SubscribeActions'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { MirrorablePublication } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const BottomOverlay: FC<Props> = ({ video }) => {
  const subscribeType = video.by?.followModule?.__typename
  const channel = video.by
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1] bg-gradient-to-t from-gray-900 to-transparent px-3 pb-3 pt-5 md:rounded-b-xl">
      <div className="pb-2">
        <h1 className="line-clamp-2 text-white">
          {video.metadata.marketplace?.name}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href={`/channel/${channel?.handle}`}
            className="flex flex-none cursor-pointer items-center space-x-2"
          >
            <img
              src={getProfilePicture(channel, 'AVATAR')}
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={channel?.handle}
            />
            <div className="flex min-w-0 flex-col items-start text-white">
              <h6 className="flex max-w-full items-center space-x-1">
                <span className="truncate">
                  {trimLensHandle(channel?.handle)}
                </span>
                <Badge
                  id={channel?.id}
                  color="text-gray-300 dark:text-gray-300"
                />
              </h6>
              <span className="inline-flex items-center space-x-1 text-xs">
                {formatNumber(channel?.stats.followers)} subscribers
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <SubscribeActions profile={video.by} subscribeType={subscribeType} />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
