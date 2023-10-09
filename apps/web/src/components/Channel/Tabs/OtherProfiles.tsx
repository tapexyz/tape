import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t, Trans } from '@lingui/macro'
import {
  formatNumber,
  getProfilePicture,
  trimLensHandle
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useProfilesQuery } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  profile: Profile
}

const OtherProfiles: FC<Props> = ({ profile }) => {
  const { data, loading } = useProfilesQuery({
    variables: {
      request: { where: { ownedBy: [profile?.ownedBy.address] } }
    },
    skip: !profile?.ownedBy
  })
  const allChannels = data?.profiles?.items as Profile[]

  if (loading) {
    return <OtherChannelsShimmer />
  }

  if (allChannels?.length === 1) {
    return <NoDataFound isCenter withImage text={t`No other channels found`} />
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      {allChannels?.map(
        (p) =>
          p.id !== profile.id && (
            <div
              key={profile.id}
              className="flex w-44 flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-800"
            >
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
                  {formatNumber(profile.stats.followers)}{' '}
                  <Trans>followers</Trans>
                </div>
              </div>
              <FollowActions profile={profile} />
            </div>
          )
      )}
    </div>
  )
}

export default OtherProfiles
