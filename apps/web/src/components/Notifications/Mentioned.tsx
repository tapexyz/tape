import IsVerified from '@components/Common/IsVerified'
import type { NewMentionNotification } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'

interface Props {
  notification: NewMentionNotification
}

const MentionedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link
          href={`/channel/${notification?.mentionPublication?.profile?.handle}`}
          className="inline-flex items-center space-x-1.5 font-base"
        >
          <img
            className="w-5 h-5 rounded-full"
            src={getProfilePicture(
              notification?.mentionPublication.profile,
              'avatar'
            )}
            alt={notification?.mentionPublication?.profile?.handle}
            draggable={false}
          />
          <div className="flex items-center space-x-0.5">
            <span>{notification?.mentionPublication?.profile?.handle}</span>
            <IsVerified
              id={notification?.mentionPublication?.profile?.id}
              size="xs"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 truncate dark:text-gray-400">
          <Link
            href={`/watch/${notification?.mentionPublication.id}`}
            className="mr-1 text-indigo-500"
          >
            mentioned
          </Link>
          your channel
        </span>
        <div className="flex items-center flex-none space-x-1 text-xs dark:text-gray-300 text-gray-700">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default MentionedNotification
