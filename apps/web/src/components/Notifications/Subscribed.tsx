import IsVerified from '@components/Common/IsVerified'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import useAppStore from '@lib/store'
import type { NewFollowerNotification } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getRandomProfilePicture } from 'utils/functions/getRandomProfilePicture'
import imageCdn from 'utils/functions/imageCdn'
import { shortenAddress } from 'utils/functions/shortenAddress'

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
              className="w-5 h-5 rounded-full"
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
                className="w-5 h-5 rounded-full"
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
        <span className="text-gray-600 dark:text-gray-400">
          {selectedChannel?.followModule ? 'joined' : 'subscribed'} the channel
        </span>
        <div className="flex items-center flex-none dark:text-gray-300 text-gray-700">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default SubscribedNotification
