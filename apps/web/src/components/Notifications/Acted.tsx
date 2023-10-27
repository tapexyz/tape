import HoverableProfile from '@components/Common/HoverableProfile'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import {
  getProfile,
  getProfilePicture,
  getPublication,
  getPublicationData
} from '@tape.xyz/generic'
import type { ActedNotification, OpenActionProfileActed } from '@tape.xyz/lens'
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
        <CollectOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {actions?.map(({ by }: OpenActionProfileActed) => (
            <HoverableProfile profile={by} key={by?.id}>
              <img
                className="h-7 w-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(by)}
                draggable={false}
                alt={getProfile(by)?.slug}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">acted on your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="line-clamp-2 font-medium opacity-50"
        >
          {getPublicationData(targetPublication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Acted
