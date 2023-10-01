import Badge from '@components/Common/Badge'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import {
  getProfilePicture,
  getRandomProfilePicture,
  imageCdn,
  shortenAddress,
  trimLensHandle
} from '@lenstube/generic'
import type { NewFollowerNotification } from '@lenstube/lens'
import { getRelativeTime } from '@lib/formatTime'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

interface Props {
  notification: NewFollowerNotification
}

const SubscribedNotification: FC<Props> = ({ notification }) => {
  const activeChannel = useChannelStore((state) => state.activeChannel)

  return (
    <>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Link
            href={`/channel/${trimLensHandle(
              notification?.wallet?.defaultProfile?.handle
            )}`}
            className="font-base inline-flex items-center space-x-1.5"
          >
            <img
              className="h-5 w-5 rounded-full"
              src={getProfilePicture(
                notification.wallet.defaultProfile,
                'AVATAR'
              )}
              alt={notification.wallet?.defaultProfile?.handle}
              draggable={false}
            />
            <div className="flex items-center space-x-0.5">
              <span>
                {trimLensHandle(notification?.wallet?.defaultProfile?.handle)}
              </span>
              <Badge id={notification?.wallet?.defaultProfile?.id} size="xs" />
            </div>
          </Link>
        ) : (
          <AddressExplorerLink address={notification?.wallet?.address}>
            <span className="font-base inline-flex items-center space-x-1.5">
              <img
                className="h-5 w-5 rounded-full"
                src={imageCdn(
                  getRandomProfilePicture(notification.wallet.address),
                  'AVATAR'
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
          {activeChannel?.followModule ? t`joined` : t`subscribed`}{' '}
          <Trans>the channel</Trans>
        </span>
        <div className="flex flex-none items-center text-gray-600 dark:text-gray-400">
          <span>{getRelativeTime(notification?.createdAt)}</span>
        </div>
      </div>
    </>
  )
}

export default SubscribedNotification
