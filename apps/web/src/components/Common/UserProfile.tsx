import type { Profile } from '@tape.xyz/lens'

import { Avatar } from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

import HoverableProfile from './HoverableProfile'

const UserProfile = ({ profile }: { profile: Profile }) => {
  if (!profile) {
    return null
  }

  return (
    <div>
      <Link
        className="flex items-center space-x-2"
        href={getProfile(profile).link}
      >
        <Avatar
          alt={getProfile(profile).displayName}
          fallback={getProfile(profile).displayName[0]}
          radius="full"
          src={getProfilePicture(profile, 'AVATAR')}
        />
        <div className="flex flex-col">
          <h2 className="line-clamp-1 font-semibold">
            {getProfile(profile).displayName}
          </h2>
          <HoverableProfile profile={profile} />
        </div>
      </Link>
    </div>
  )
}

export default UserProfile
