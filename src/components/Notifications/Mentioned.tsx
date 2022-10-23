import IsVerified from '@components/Common/IsVerified'
import { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC } from 'react'
import { NewMentionNotification } from 'src/types'

dayjs.extend(relativeTime)

interface Props {
  notification: NewMentionNotification
}

const MentionedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Menu.Item
          as={NextLink}
          href={`/${notification?.mentionPublication?.profile?.handle}`}
          className="inline-flex items-center space-x-1.5 font-base"
        >
          <img
            className="w-4 h-4 rounded"
            src={getProfilePicture(
              notification?.mentionPublication.profile,
              'avatar'
            )}
            alt="channel picture"
            draggable={false}
          />
          <div className="flex items-center space-x-0.5">
            <span>{notification?.mentionPublication?.profile?.handle}</span>
            <IsVerified
              id={notification?.mentionPublication?.profile?.id}
              size="xs"
            />
          </div>
        </Menu.Item>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 truncate dark:text-gray-400">
          <Menu.Item
            as={NextLink}
            href={`/watch/${notification?.mentionPublication.id}`}
            className="mr-1 text-indigo-500"
          >
            mentioned
          </Menu.Item>
          your channel
        </span>
        <div className="flex items-center flex-none space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default MentionedNotification
