import IsVerified from '@components/Common/IsVerified'
import type { NewCommentNotification } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'

interface Props {
  notification: NewCommentNotification
}

const CommentedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Link
          href={`/channel/${notification?.profile?.handle}`}
          className="font-base inline-flex items-center space-x-1.5"
        >
          <img
            className="h-5 w-5 rounded-full"
            src={getProfilePicture(notification.profile, 'avatar')}
            alt={notification.profile?.handle}
            draggable={false}
          />
          <div className="flex items-center space-x-0.5">
            <span>{notification?.profile?.handle}</span>
            <IsVerified id={notification?.profile?.id} size="xs" />
          </div>
        </Link>
        <span className="truncate text-gray-600 dark:text-gray-400">
          commented on your
          <Link
            href={`/watch/${
              notification?.comment?.commentOn &&
              notification?.comment?.commentOn?.id
            }`}
            className="ml-1 text-indigo-500"
          >
            video
          </Link>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Link
          href={`/watch/${
            notification?.comment?.commentOn &&
            notification?.comment?.commentOn?.id
          }`}
          className="truncate py-1 text-gray-600 dark:text-gray-400"
        >
          {notification.comment?.metadata?.content}
        </Link>
        <div className="flex flex-none items-center text-gray-600 dark:text-gray-400">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default CommentedNotification
