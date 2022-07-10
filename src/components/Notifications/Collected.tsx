import { POLYGONSCAN_URL } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { NewCollectNotification, Notification, Profile } from 'src/types'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification & Notification & { profile: Profile }
}

const CollectedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Link href={`/${notification?.wallet?.defaultProfile?.handle}`}>
            <a className="inline-flex items-center space-x-1.5 font-base">
              <img
                className="w-4 h-4 rounded"
                src={getProfilePicture(notification.wallet?.defaultProfile)}
                alt="channel picture"
                draggable={false}
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
              className="w-4 h-4 rounded"
              src={imageCdn(
                getRandomProfilePicture(notification.wallet.address)
              )}
              alt="channel picture"
              draggable={false}
            />
            <div>{shortenAddress(notification?.wallet?.address)}</div>
          </a>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          minted your
          <Link
            href={`/watch/${notification?.collectedPublication.id}`}
            prefetch={false}
          >
            <a
              href={`/watch/${notification?.collectedPublication.id}`}
              className="ml-1 text-indigo-500"
            >
              video
            </a>
          </Link>
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default CollectedNotification
