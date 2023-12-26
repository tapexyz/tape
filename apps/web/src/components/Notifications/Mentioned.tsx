import type { MentionNotification } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import { getShortHandTime } from '@lib/formatTime'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

type Props = {
  notification: MentionNotification
}

const Mentioned: FC<Props> = ({ notification: { publication } }) => {
  const videoId =
    publication.__typename === 'Comment' ? publication.root.id : publication.id
  return (
    <div className="flex justify-between">
      <span className="flex space-x-4">
        <div className="p-1">
          <MentionOutline className="size-5" />
        </div>
        <div>
          <span className="flex -space-x-1.5">
            <HoverableProfile key={publication.by?.id} profile={publication.by}>
              <img
                alt={getProfile(publication.by)?.displayName}
                className="size-7 rounded-full border dark:border-gray-700/80"
                draggable={false}
                src={getProfilePicture(publication.by, 'AVATAR')}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">mentioned you</div>
          <Link
            className="text-dust line-clamp-2 font-medium"
            href={`/watch/${videoId}`}
          >
            {getPublicationData(publication.metadata)?.content}
          </Link>
        </div>
      </span>
      <span className="text-dust text-sm">
        {getShortHandTime(publication.createdAt)}
      </span>
    </div>
  )
}

export default Mentioned
