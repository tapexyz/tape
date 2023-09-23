import CommentOutline from '@components/Common/Icons/CommentOutline'
import ProfilePreview from '@components/Common/UserPreview'
import { getProfilePicture } from '@lenstube/generic'
import type { CommentNotification } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  notification: CommentNotification
}

const Commented: FC<Props> = ({ notification: { comment } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1.5">
        <CommentOutline className="h-5 w-5" />
      </div>
      <div>
        <span className="flex cursor-pointer -space-x-1.5">
          <ProfilePreview profile={comment.by} key={comment.by?.id}>
            <img
              title={comment.by?.handle}
              className="h-7 w-7 rounded-full border dark:border-gray-700/80"
              src={getProfilePicture(comment.by)}
              draggable={false}
              alt={comment.by?.handle}
            />
          </ProfilePreview>
        </span>
        <div className="py-2">commented on your publication</div>
        <Link
          href={`/watch/${comment.commentOn.id}`}
          className="font-medium opacity-50"
        >
          {comment.metadata.marketplace?.description}
        </Link>
      </div>
    </span>
  )
}

export default Commented
