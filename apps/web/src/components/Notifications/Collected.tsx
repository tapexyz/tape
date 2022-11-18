import IsVerified from '@components/Common/IsVerified'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { NewCollectNotification } from 'src/types/lens'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification
}

const CollectedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Link
            href={`/${notification?.wallet?.defaultProfile?.handle}`}
            className="inline-flex items-center space-x-1.5 font-base"
          >
            <img
              className="w-4 h-4 rounded"
              src={getProfilePicture(
                notification.wallet?.defaultProfile,
                'avatar'
              )}
              alt={notification.wallet?.defaultProfile?.handle}
              draggable={false}
            />
            <div className="flex items-center space-x-0.5">
              <span>{notification?.wallet?.defaultProfile?.handle}</span>
              <IsVerified
                id={notification?.wallet?.defaultProfile?.id}
                size="xs"
              />
            </div>
          </Link>
        ) : (
          <AddressExplorerLink address={notification?.wallet?.address}>
            <span className="inline-flex items-center space-x-1.5 font-base">
              <img
                className="w-4 h-4 rounded"
                src={imageCdn(
                  getRandomProfilePicture(notification.wallet.address),
                  'avatar'
                )}
                alt={notification.wallet?.address}
                draggable={false}
              />
              <div>{shortenAddress(notification?.wallet?.address)}</div>
            </span>
          </AddressExplorerLink>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          collected your
          {notification.collectedPublication.__typename === 'Comment' &&
            ' comment on'}
          <Link
            href={`/watch/${notification?.collectedPublication.id}`}
            className="ml-1 text-indigo-500"
          >
            video
          </Link>
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default CollectedNotification
