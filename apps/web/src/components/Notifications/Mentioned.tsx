import HoverableProfile from '@components/Common/HoverableProfile'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import { getProfilePicture } from '@lenstube/generic'
import type { MentionNotification } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: MentionNotification
}

const Mentioned: FC<Props> = ({ notification: { publication } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1.5">
        <MentionOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          <HoverableProfile profile={publication.by} key={publication.by?.id}>
            <img
              title={publication.by?.handle}
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(publication.by)}
              draggable={false}
              alt={publication.by?.handle}
            />
          </HoverableProfile>
        </span>
        <div className="py-2">mentioned you</div>
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

export default Mentioned
