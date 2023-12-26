import type { ProfileReactedResult, ReactionNotification } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

type Props = {
  notification: ReactionNotification
}

const Reactions: FC<Props> = ({ notification: { publication, reactions } }) => {
  return (
    <span className="flex space-x-5">
      <div className="p-1">
        <HeartOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {reactions.slice(0, 30).map(({ profile }: ProfileReactedResult) => (
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
        <div className="py-2">reacted to your publication</div>
        <Link
          className="text-dust line-clamp-2 font-medium"
          href={`/watch/${publication.id}`}
        >
          {getPublicationData(publication.metadata)?.title}
        </Link>
      </div>
    </span>
  )
}

export default Reactions
