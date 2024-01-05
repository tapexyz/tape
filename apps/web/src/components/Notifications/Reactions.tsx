import HoverableProfile from '@components/Common/HoverableProfile'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { ProfileReactedResult, ReactionNotification } from '@tape.xyz/lens'
import { HeartOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
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
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile, 'AVATAR')}
                draggable={false}
                alt={getProfile(profile)?.displayName}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">reacted to your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="text-dust line-clamp-2 font-medium"
        >
          {getPublicationData(publication.metadata)?.title}
        </Link>
      </div>
    </span>
  )
}

export default Reactions
