import HoverableProfile from '@components/Common/HoverableProfile'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { MentionNotification } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: MentionNotification
}

const Mentioned: FC<Props> = ({ notification: { publication } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <MentionOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          <HoverableProfile profile={publication.by} key={publication.by?.id}>
            <img
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(publication.by)}
              draggable={false}
              alt={getProfile(publication.by)?.displayName}
            />
          </HoverableProfile>
        </span>
        <div className="py-2">mentioned you</div>
        <Link
          href={`/watch/${publication.id}`}
          className="line-clamp-2 font-medium opacity-50"
        >
          {getPublicationData(publication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Mentioned
