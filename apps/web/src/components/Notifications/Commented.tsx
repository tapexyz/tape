import HoverableProfile from '@components/Common/HoverableProfile';
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@dragverse/generic';
import type { CommentNotification } from '@dragverse/lens';
import { CommentOutline } from '@dragverse/ui';
import { getShortHandTime } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';

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
            <HoverableProfile profile={comment.by} key={comment.by?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(comment.by, 'AVATAR')}
                draggable={false}
                alt={getProfile(comment.by)?.slug}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">commented on your publication</div>
          <Link
            href={`/watch/${comment.root.id}`}
            className="text-dust line-clamp-2 font-medium"
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
