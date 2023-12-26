import { Avatar } from '@radix-ui/themes'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
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
        href={getProfile(profile).link}
        className="flex items-center space-x-2"
      >
        <Avatar
          radius="full"
          src={getProfilePicture(profile, 'AVATAR')}
          fallback={getProfile(profile).displayName[0]}
          alt={getProfile(profile).displayName}
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
