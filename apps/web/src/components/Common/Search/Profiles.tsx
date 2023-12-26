import type { Profile } from '@tape.xyz/lens'
import type { FC } from 'react'

import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

import Badge from '../Badge'
import UserOutline from '../Icons/UserOutline'

interface Props {
  clearSearch: () => void
  loading: boolean
  results: Profile[]
}

const Profiles: FC<Props> = ({ clearSearch, loading, results }) => {
  return (
    <div>
      {results?.map((profile: Profile) => (
        <div
          className="hover:bg-gallery dark:hover:bg-smoke relative cursor-default select-none rounded-md pl-3 pr-4"
          key={profile.id}
        >
          <Link
            className="flex flex-col justify-center space-y-1 py-2"
            href={`/u/${getProfile(profile)?.slug}`}
            key={getProfile(profile)?.slug}
            onClick={() => clearSearch()}
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <img
                  alt="pfp"
                  className="size-5 rounded-full"
                  draggable={false}
                  src={getProfilePicture(profile, 'AVATAR')}
                />
                <div className="flex items-center space-x-1">
                  <p className="line-clamp-1 truncate text-base">
                    <span>{getProfile(profile)?.slug}</span>
                  </p>
                  <Badge id={profile?.id} size="xs" />
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <UserOutline className="size-2.5" />
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
