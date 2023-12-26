import type { QuoteNotification } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import QuoteOutline from '@components/Common/Icons/QuoteOutline'
import { getShortHandTime } from '@lib/formatTime'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
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
            <HoverableProfile key={quote.by?.id} profile={quote.by}>
              <img
                alt={getProfile(quote.by)?.displayName}
                className="size-7 rounded-full border dark:border-gray-700/80"
                draggable={false}
                src={getProfilePicture(quote.by, 'AVATAR')}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">quoted your publication</div>
          <Link
            className="text-dust line-clamp-2 font-medium"
            href={`/watch/${quote.id}`}
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
