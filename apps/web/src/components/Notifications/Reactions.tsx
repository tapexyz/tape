import HoverableProfile from '@components/Common/HoverableProfile'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import { getProfilePicture } from '@tape.xyz/generic'
import type { ProfileReactedResult, ReactionNotification } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: ReactionNotification
}

const Reactions: FC<Props> = ({ notification: { publication, reactions } }) => {
  return (
    <span className="flex space-x-5">
      <div className="p-1.5">
        <HeartOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          {reactions?.map(({ profile }: ProfileReactedResult) => (
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                title={profile?.handle}
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile)}
                draggable={false}
                alt={profile?.handle}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">reacted to your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="font-medium opacity-50"
        >
          {publication.metadata.marketplace?.name}
        </Link>
      </div>
    </span>
  )
}

export default Reactions
