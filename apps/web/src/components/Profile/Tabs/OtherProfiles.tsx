import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import FollowActions from '@components/Common/FollowActions'
import OtherChannelsShimmer from '@components/Shimmers/OtherChannelsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import { useProfilesQuery } from '@tape.xyz/lens'
import Link from 'next/link'
import React from 'react'

type Props = {
  currentProfile: Profile
}

const OtherProfiles: FC<Props> = ({ currentProfile }) => {
  const { data, loading } = useProfilesQuery({
    skip: !currentProfile?.ownedBy,
    variables: {
      request: { where: { ownedBy: [currentProfile?.ownedBy.address] } }
    }
  })
  const allProfiles = data?.profiles?.items as Profile[]

  if (loading) {
    return <OtherChannelsShimmer />
  }

  if (allProfiles?.length === 1) {
    return <NoDataFound isCenter text="No other channels found" withImage />
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      {allProfiles?.map(
        (profile) =>
          profile.id !== currentProfile.id && (
            <div
              className="flex w-44 flex-col items-center justify-center rounded-xl border border-gray-200 py-3 dark:border-gray-800"
              key={profile.id}
            >
              <Link href={`/u/${getProfile(profile)?.slug}`}>
                <img
                  alt={getProfile(profile)?.slug}
                  className="size-24 rounded-full object-cover"
                  draggable={false}
                  src={getProfilePicture(profile, 'AVATAR_LG')}
                />
              </Link>
              <div className="w-full px-1.5 py-2">
                <div className="flex-1 text-center">
                  <Link
                    className="block truncate font-medium"
                    href={`/u/${getProfile(profile)?.slug}`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{getProfile(profile)?.slug}</span>
                      <Badge id={profile?.id} />
                    </div>
                  </Link>
                </div>
                <div className="text-center text-xs opacity-70">
                  {formatNumber(profile.stats.followers)} followers
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
