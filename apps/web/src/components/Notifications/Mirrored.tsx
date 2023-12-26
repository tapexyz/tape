import type { MirrorNotification, ProfileMirrorResult } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

type Props = {
  notification: MirrorNotification
}

const Mirrored: FC<Props> = ({ notification: { mirrors, publication } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <MirrorOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {mirrors.slice(0, 30).map(({ profile }: ProfileMirrorResult) => (
            <HoverableProfile key={profile?.id} profile={profile}>
              <img
                alt={getProfile(profile)?.displayName}
                className="size-7 rounded-full border dark:border-gray-700/80"
                draggable={false}
                src={getProfilePicture(profile, 'AVATAR')}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">mirrored your publication</div>
        <Link
          className="text-dust line-clamp-2 font-medium"
          href={`/watch/${publication.id}`}
        >
          {getPublicationData(publication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Mirrored
