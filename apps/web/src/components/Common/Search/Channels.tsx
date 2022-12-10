import type { Profile } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BiUser } from 'react-icons/bi'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

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
          className="relative pl-3 pr-4 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-900"
          role="button"
        >
          <Link
            href={`/channel/${channel?.handle}`}
            key={channel?.handle}
            className="flex flex-col justify-center py-2 space-y-1 rounded-xl"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex items-center w-3/4 space-x-2">
                <img
                  className="w-5 h-5 rounded-md"
                  src={getProfilePicture(channel, 'avatar')}
                  draggable={false}
                  alt="pfp"
                />
                <div className="flex items-center space-x-1">
                  <p className="text-base truncate line-clamp-1">
                    <span>{channel?.handle}</span>
                  </p>
                  <IsVerified id={channel?.id} size="xs" />
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs whitespace-nowrap opacity-60">
                <BiUser />
                <span>{formatNumber(channel.stats.totalFollowers)}</span>
              </span>
            </span>
            {channel.bio && (
              <p className="text-sm truncate opacity-60">{channel.bio}</p>
            )}
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative p-5 text-center cursor-default select-none">
          No results found.
        </div>
      )}
    </>
  )
}

export default Channels
