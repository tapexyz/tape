import type { ActedNotification, OpenActionProfileActed } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

type Props = {
  notification: ActedNotification
}

const Acted: FC<Props> = ({ notification: { actions, publication } }) => {
  const targetPublication = getPublication(publication)

  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <CollectOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {actions.slice(0, 30).map(({ by }: OpenActionProfileActed) => (
            <HoverableProfile key={by?.id} profile={by}>
              <img
                alt={getProfile(by)?.slug}
                className="size-7 rounded-full border dark:border-gray-700/80"
                draggable={false}
                src={getProfilePicture(by, 'AVATAR')}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">acted on your publication</div>
        <Link
          className="text-dust line-clamp-2 font-medium"
          href={`/watch/${publication.id}`}
        >
          {getPublicationData(targetPublication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Acted
