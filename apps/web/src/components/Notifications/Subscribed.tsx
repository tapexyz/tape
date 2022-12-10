import IsVerified from '@components/Common/IsVerified'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import useAppStore from '@lib/store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { NewFollowerNotification } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import { shortenAddress } from 'utils/functions/shortenAddress'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification
}

const SubscribedNotification: FC<Props> = ({ notification }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  return (
    <>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Link
            href={`/channel/${notification?.wallet?.defaultProfile?.handle}`}
            className="inline-flex items-center space-x-1.5 font-base"
          >
            <img
              className="w-4 h-4 rounded"
              src={getProfilePicture(
                notification.wallet.defaultProfile,
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
          {selectedChannel?.followModule ? 'joined' : 'subscribed'} the channel
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default SubscribedNotification
