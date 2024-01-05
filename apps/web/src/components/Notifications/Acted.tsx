import HoverableProfile from '@components/Common/HoverableProfile'
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData
} from '@tape.xyz/generic'
import type { ActedNotification, OpenActionProfileActed } from '@tape.xyz/lens'
import { CollectOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: ActedNotification
}

const Acted: FC<Props> = ({ notification: { publication, actions } }) => {
  const targetPublication = getPublication(publication)

  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <CollectOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {actions.slice(0, 30).map(({ by }: OpenActionProfileActed) => (
            <HoverableProfile profile={by} key={by?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(by, 'AVATAR')}
                draggable={false}
                alt={getProfile(by)?.slug}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">acted on your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="text-dust line-clamp-2 font-medium"
        >
          {getPublicationData(targetPublication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Acted
