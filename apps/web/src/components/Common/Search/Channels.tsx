import { Trans } from '@lingui/macro'
import type { Profile } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import formatNumber from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

import UserOutline from '../Icons/UserOutline'
import IsVerified from '../IsVerified'

interface Props {
  results: Profile[]
  loading: boolean
  clearSearch: () => void
}

const Channels: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((channel: Profile) => (
        <div
          onClick={() => clearSearch()}
          key={channel.id}
          className="relative cursor-default select-none pl-3 pr-4 hover:bg-gray-100 dark:hover:bg-gray-900"
          role="button"
          data-testid={`search-channel-${channel.handle}`}
        >
          <Link
            href={`/channel/${channel?.handle}`}
            key={channel?.handle}
            className="flex flex-col justify-center space-y-1 rounded-xl py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <img
                  className="h-5 w-5 rounded-md"
                  src={getProfilePicture(channel, 'avatar')}
                  draggable={false}
                  alt="pfp"
                />
                <div className="flex items-center space-x-1">
                  <p className="line-clamp-1 truncate text-base">
                    <span>{channel?.handle}</span>
                  </p>
                  <IsVerified id={channel?.id} size="xs" />
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <UserOutline className="h-2.5 w-2.5" />
                <span>{formatNumber(channel.stats.totalFollowers)}</span>
              </span>
            </span>
            {channel.bio && (
              <p className="truncate text-sm opacity-60">{channel.bio}</p>
            )}
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">
          <Trans>No results found</Trans>
        </div>
      )}
    </>
  )
}

export default Channels
