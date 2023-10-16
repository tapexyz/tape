import HoverableProfile from '@components/Common/HoverableProfile'
import FollowOutline from '@components/Common/Icons/FollowOutline'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { MirrorNotification, ProfileMirrorResult } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: MirrorNotification
}

const Mirrored: FC<Props> = ({ notification: { mirrors, publication } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1.5">
        <FollowOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          {mirrors?.map(({ profile }: ProfileMirrorResult) => (
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile)}
                draggable={false}
                alt={getProfile(profile)?.displayName}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">mirrored your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="font-medium opacity-50"
        >
          {publication.metadata.marketplace?.description}
        </Link>
      </div>
    </span>
  )
}

export default Mirrored
