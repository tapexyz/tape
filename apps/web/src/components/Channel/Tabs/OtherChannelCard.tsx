import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import type { Profile } from 'lens'
import Link from 'next/link'
import React from 'react'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

const OtherChannelCard = ({ channel }: { channel: Profile }) => {
  const subscribeType = channel?.followModule?.__typename

  return (
    <div className="flex w-44 flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-800">
      <Link href={`/channel/${channel.handle}`}>
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={getProfilePicture(channel, 'avatar_lg')}
          alt={channel?.handle}
          draggable={false}
        />
      </Link>
      <div className="w-full px-1.5 py-2">
        <div className="flex-1 text-center">
          <Link
            href={`/channel/${channel.handle}`}
            className="block truncate font-medium"
          >
            <div className="flex items-center justify-center space-x-1">
              <span>{channel.handle}</span>
              <IsVerified id={channel?.id} />
            </div>
          </Link>
        </div>
        <div className="text-center text-xs opacity-70">
          {formatNumber(channel.stats.totalFollowers)} subscribers
        </div>
      </div>
      <SubscribeActions channel={channel} subscribeType={subscribeType} />
    </div>
  )
}

export default OtherChannelCard
