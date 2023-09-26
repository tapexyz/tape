import Badge from '@components/Common/Badge'
import SubscribeActions from '@components/Common/SubscribeActions'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'

const OtherChannelCard = ({ profile }: { profile: Profile }) => {
  const subscribeType = profile?.followModule?.__typename

  return (
    <div className="flex w-44 flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-800">
      <Link href={`/channel/${profile.handle}`}>
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={getProfilePicture(profile, 'AVATAR_LG')}
          alt={profile?.handle}
          draggable={false}
        />
      </Link>
      <div className="w-full px-1.5 py-2">
        <div className="flex-1 text-center">
          <Link
            href={`/channel/${trimLensHandle(profile.handle)}`}
            className="block truncate font-medium"
          >
            <div className="flex items-center justify-center space-x-1">
              <span>{trimLensHandle(profile.handle)}</span>
              <Badge id={profile?.id} />
            </div>
          </Link>
        </div>
        <div className="text-center text-xs opacity-70">
          {formatNumber(profile.stats.followers)} <Trans>subscribers</Trans>
        </div>
      </div>
      <SubscribeActions profile={profile} subscribeType={subscribeType} />
    </div>
  )
}

export default OtherChannelCard
