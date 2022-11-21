import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'utils/custom-types'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: LenstubePublication
}

const BottomOverlay: FC<Props> = ({ video }) => {
  const subscribeType = video.profile?.followModule?.__typename
  const channel = video.profile
  return (
    <div className="absolute bottom-0 left-0 right-0 px-3 pt-5 pb-3 bg-gradient-to-t from-gray-900 to-transparent">
      <div className="pb-2">
        <h1 className="text-white line-clamp-2">{video.metadata.name}</h1>
      </div>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <Link
            href={`/${channel?.handle}`}
            className="flex items-center flex-none space-x-2 cursor-pointer"
          >
            <img
              src={getProfilePicture(channel, 'avatar')}
              className="w-9 h-9 rounded-xl"
              draggable={false}
              alt={channel?.handle}
            />
            <div className="flex flex-col items-start text-white min-w-0">
              <h6 className="flex items-center space-x-1 max-w-full">
                <span className="truncate">{channel?.handle}</span>
                <IsVerified
                  id={channel?.id}
                  color="text-gray-300 dark:text-gray-300"
                />
              </h6>
              <span className="inline-flex items-center space-x-1 text-xs">
                {formatNumber(channel?.stats.totalFollowers)} subscribers
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <SubscribeActions
            channel={video.profile}
            subscribeType={subscribeType}
          />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
