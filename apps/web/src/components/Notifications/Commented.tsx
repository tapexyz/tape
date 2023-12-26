import type { CommentNotification } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import { getShortHandTime } from '@lib/formatTime'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import Link from 'next/link'
import React from 'react'

type Props = {
  notification: CommentNotification
}

const Commented: FC<Props> = ({ notification: { comment } }) => {
  return (
    <div className="flex justify-between">
      <span className="flex space-x-4">
        <div className="p-1">
          <CommentOutline className="size-5" />
        </div>
        <div>
          <span className="flex -space-x-1.5">
            <HoverableProfile key={comment.by?.id} profile={comment.by}>
              <img
                alt={getProfile(comment.by)?.slug}
                className="size-7 rounded-full border dark:border-gray-700/80"
                draggable={false}
                src={getProfilePicture(comment.by, 'AVATAR')}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">commented on your publication</div>
          <Link
            className="text-dust line-clamp-2 font-medium"
            href={`/watch/${comment.root.id}`}
          >
            {getPublicationData(comment.metadata)?.content}
          </Link>
        </div>
      </span>
      <span className="text-dust text-sm">
        {getShortHandTime(comment.createdAt)}
      </span>
    </div>
  )
}

export default Commented
