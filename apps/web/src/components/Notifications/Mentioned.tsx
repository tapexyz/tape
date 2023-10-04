import Badge from '@components/Common/Badge'
import { getRelativeTime } from '@lib/formatTime'
import { Trans } from '@lingui/macro'
import { getProfilePicture, trimLensHandle } from '@tape.xyz/generic'
import type { NewMentionNotification } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

interface Props {
  notification: NewMentionNotification
}

const MentionedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link
          href={`/channel/${trimLensHandle(
            notification?.mentionPublication?.profile?.handle
          )}`}
          className="font-base inline-flex items-center space-x-1.5"
        >
          <img
            className="h-5 w-5 rounded-full"
            src={getProfilePicture(
              notification?.mentionPublication.profile,
              'AVATAR'
            )}
            alt={notification?.mentionPublication?.profile?.handle}
            draggable={false}
          />
          <div className="flex items-center space-x-0.5">
            <span>
              {trimLensHandle(
                notification?.mentionPublication?.profile?.handle
              )}
            </span>
            <Badge
              id={notification?.mentionPublication?.profile?.id}
              size="xs"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <span className="truncate text-gray-600 dark:text-gray-400">
          <Link
            href={`/watch/${notification?.mentionPublication.id}`}
            className="text-brand-500 mr-1"
          >
            <Trans>mentioned</Trans>
          </Link>
          <Trans>your channel</Trans>
        </span>
        <div className="flex flex-none items-center space-x-1 text-gray-600 dark:text-gray-400">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default MentionedNotification
