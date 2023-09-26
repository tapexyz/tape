import HoverableProfile from '@components/Common/HoverableProfile'
import FollowOutline from '@components/Common/Icons/FollowOutline'
import { getProfilePicture } from '@lenstube/generic'
import type { QuoteNotification } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: QuoteNotification
}

const Quoted: FC<Props> = ({ notification: { quote } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1.5">
        <FollowOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          <HoverableProfile profile={quote.by} key={quote.by?.id}>
            <img
              title={quote.by?.handle}
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(quote.by)}
              draggable={false}
              alt={quote.by?.handle}
            />
          </HoverableProfile>
        </span>
        <div className="py-2">quoted your publication</div>
        <Link href={`/watch/${quote.id}`} className="font-medium opacity-50">
          {quote.quoteOn.metadata.marketplace?.description}
        </Link>
      </div>
    </span>
  )
}

export default Quoted
