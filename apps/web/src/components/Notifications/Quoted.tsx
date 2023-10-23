import HoverableProfile from '@components/Common/HoverableProfile'
import QuoteOutline from '@components/Common/Icons/QuoteOutline'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type { QuoteNotification } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: QuoteNotification
}

const Quoted: FC<Props> = ({ notification: { quote } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <QuoteOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          <HoverableProfile profile={quote.by} key={quote.by?.id}>
            <img
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(quote.by)}
              draggable={false}
              alt={getProfile(quote.by)?.displayName}
            />
          </HoverableProfile>
        </span>
        <div className="py-2">quoted your publication</div>
        <Link href={`/watch/${quote.id}`} className="font-medium opacity-50">
          {getPublicationData(quote.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Quoted
