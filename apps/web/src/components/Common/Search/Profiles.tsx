import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import Badge from '../Badge'
import UserOutline from '../Icons/UserOutline'

interface Props {
  results: Profile[]
  loading: boolean
  clearSearch: () => void
}

const Profiles: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <div>
      {results?.map((profile: Profile) => (
        <div
          key={profile.id}
          className="hover:bg-brand-50 rounded-small relative cursor-default select-none pl-3 pr-4 dark:hover:bg-gray-800"
        >
          <Link
            onClick={() => clearSearch()}
            href={`/u/${getProfile(profile)?.slug}`}
            key={getProfile(profile)?.slug}
            className="flex flex-col justify-center space-y-1 py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <img
                  className="h-5 w-5 rounded-full"
                  src={getProfilePicture(profile, 'AVATAR')}
                  draggable={false}
                  alt="pfp"
                />
                <div className="flex items-center space-x-1">
                  <p className="line-clamp-1 truncate text-base">
                    <span>{getProfile(profile)?.slug}</span>
                  </p>
                  <Badge id={profile?.id} size="xs" />
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <UserOutline className="h-2.5 w-2.5" />
                <span>{formatNumber(profile.stats.followers)}</span>
              </span>
            </span>
            {profile.metadata?.bio && (
              <p className="truncate text-sm opacity-60">
                {profile.metadata?.bio}
              </p>
            )}
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">
          No results found
        </div>
      )}
    </div>
  )
}

export default Profiles
