import useAppStore from '@lib/store'
import { POLYGONSCAN_URL } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import { shortenAddress } from '@utils/functions/shortenAddress'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { NewFollowerNotification, Notification, Profile } from 'src/types'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification & Notification & { profile: Profile }
}

const SubscriberNotification: FC<Props> = ({ notification }) => {
  const { selectedChannel } = useAppStore()

  return (
    <div>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Link href={`/${notification?.wallet?.defaultProfile?.handle}`}>
            <a className="inline-flex items-center space-x-1.5 font-base">
              <img
                className="w-4 h-4 rounded-full"
                src={getProfilePicture(notification.wallet.defaultProfile)}
                alt=""
              />
              <div>{notification?.wallet?.defaultProfile?.handle}</div>
            </a>
          </Link>
        ) : (
          <a
            className="inline-flex items-center space-x-1.5 font-base"
            href={`${POLYGONSCAN_URL}/address/${notification?.wallet?.address}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              className="w-4 h-4 rounded-full"
              src={getRandomProfilePicture(notification.wallet.address)}
              alt=""
            />
            <div>{shortenAddress(notification?.wallet?.address)}</div>
          </a>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-400">
          {selectedChannel?.followModule ? 'joined' : 'subscribed'} the channel
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </div>
  )
}

export default SubscriberNotification
