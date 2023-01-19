import IsVerified from '@components/Common/IsVerified'
import type { NewReactionNotification } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'

interface Props {
  notification: NewReactionNotification
}

const ReactedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link
          href={`/channel/${notification?.profile?.handle}`}
          className="inline-flex items-center space-x-1.5 font-base"
        >
          <img
            className="w-5 h-5 rounded-full"
            src={getProfilePicture(notification.profile, 'avatar')}
            alt={notification.profile?.handle}
            draggable={false}
          />
          <div className="flex items-center space-x-0.5">
            <span>{notification?.profile?.handle}</span>
            <IsVerified id={notification?.profile?.id} size="xs" />
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 truncate dark:text-gray-400">
          {notification.reaction === 'UPVOTE' ? 'liked' : 'dislisked'} your
          {notification.publication.__typename === 'Comment' && ' comment on'}
          <Link
            href={`/watch/${
              notification.publication.__typename === 'Comment'
                ? notification.publication?.mainPost?.id
                : notification?.publication.id
            }`}
            className="ml-1 text-indigo-500"
          >
            video
          </Link>
        </span>
        <div className="flex items-center flex-none dark:text-gray-300 text-gray-700">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default ReactedNotification
