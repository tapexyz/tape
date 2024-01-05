import HoverableProfile from '@components/Common/HoverableProfile'
import { getShortHandTime } from '@lib/formatTime'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { QuoteNotification } from '@tape.xyz/lens'
import { QuoteOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: QuoteNotification
}

const Quoted: FC<Props> = ({ notification: { quote } }) => {
  return (
    <div className="flex justify-between">
      <span className="flex space-x-4">
        <div className="p-1">
          <QuoteOutline className="size-5" />
        </div>
        <div>
          <span className="flex -space-x-1.5">
            <HoverableProfile profile={quote.by} key={quote.by?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(quote.by, 'AVATAR')}
                draggable={false}
                alt={getProfile(quote.by)?.displayName}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">quoted your publication</div>
          <Link
            href={`/watch/${quote.id}`}
            className="text-dust line-clamp-2 font-medium"
          >
            {getPublicationData(quote.metadata)?.content}
          </Link>
        </div>
      </span>
      <span className="text-dust text-sm">
        {getShortHandTime(quote.createdAt)}
      </span>
    </div>
  )
}

export default Quoted
