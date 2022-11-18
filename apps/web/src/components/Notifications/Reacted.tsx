import IsVerified from '@components/Common/IsVerified'
import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type {
  NewReactionNotification,
  Notification,
  Profile
} from 'src/types/lens'

dayjs.extend(relativeTime)

interface Props {
  notification: NewReactionNotification & Notification & { profile: Profile }
}

const ReactedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link
          href={`/${notification?.profile?.handle}`}
          className="inline-flex items-center space-x-1.5 font-base"
        >
          <img
            className="w-4 h-4 rounded"
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
        <span className="text-sm text-gray-600 truncate dark:text-gray-400">
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
        <div className="flex items-center flex-none space-x-1 text-xs text-gray-500">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default ReactedNotification
