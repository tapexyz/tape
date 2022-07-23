import getProfilePicture from '@utils/functions/getProfilePicture'
import Link from 'next/link'
import React, { FC } from 'react'
import { BiUser } from 'react-icons/bi'
import { Profile } from 'src/types'

interface Props {
  results: Array<Profile>
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
        >
          <>
            <Link href={`/${channel?.handle}`} key={channel?.handle}>
              <a
                href={`/u/${channel?.handle}`}
                className="flex flex-col justify-center py-2 space-y-1 rounded-xl"
              >
                <span className="flex items-center justify-between">
                  <div className="inline-flex items-center w-3/4 space-x-2">
                    <img
                      className="w-5 h-5 rounded-md"
                      src={getProfilePicture(channel)}
                      draggable={false}
                      alt="pfp"
                    />
                    <p className="text-base truncate line-clamp-1">
                      {channel?.handle}
                    </p>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-xs whitespace-nowrap opacity-60">
                    <BiUser />
                    <span>{channel.stats.totalFollowers}</span>
                  </span>
                </span>
                {channel.bio && (
                  <p className="text-sm truncate opacity-60">{channel.bio}</p>
                )}
              </a>
            </Link>
          </>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative px-4 text-center py-2.5 cursor-default select-none">
          No results found.
        </div>
      )}
    </>
  )
}

export default Channels
