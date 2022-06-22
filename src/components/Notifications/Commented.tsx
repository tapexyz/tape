import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { NewCommentNotification, Notification, Profile } from 'src/types'
import { LenstubePublication } from 'src/types/local'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCommentNotification &
    Notification & {
      profile: Profile
      comment: { commentOn: LenstubePublication }
    }
}

const CommentedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link href={`/${notification?.profile?.handle}`} prefetch={false}>
          <a className="inline-flex items-center space-x-1.5 font-base">
            <img
              className="w-4 h-4 rounded"
              src={getProfilePicture(notification.profile)}
              alt=""
              draggable={false}
            />
            <div>{notification?.profile?.handle}</div>
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 truncate dark:text-gray-400">
          commented on your
          <Link
            href={`/watch/${notification?.comment?.commentOn.id}`}
            prefetch={false}
          >
            <a
              href={`/watch/${notification?.comment.id}`}
              className="ml-1 text-indigo-500"
            >
              video
            </a>
          </Link>
        </span>
        <div className="flex items-center flex-none space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default CommentedNotification
