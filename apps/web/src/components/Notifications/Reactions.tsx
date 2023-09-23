import DislikeOutline from '@components/Common/Icons/DislikeOutline'
import LikeOutline from '@components/Common/Icons/LikeOutline'
import ProfilePreview from '@components/Common/UserPreview'
import { getProfilePicture } from '@lenstube/generic'
import type { ProfileReactedResult, ReactionNotification } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: ReactionNotification
}

const Reactions: FC<Props> = ({ notification: { publication, reactions } }) => {
  return (
    <span className="flex space-x-4">
      <div className="flex -space-y-2.5 space-x-0.5 pt-3">
        <DislikeOutline className="h-4 w-4" />
        <LikeOutline className="h-4 w-4" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          {reactions?.map(({ profile }: ProfileReactedResult) => (
            <ProfilePreview profile={profile} key={profile?.id}>
              <img
                title={profile?.handle}
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile)}
                draggable={false}
                alt={profile?.handle}
              />
            </ProfilePreview>
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
