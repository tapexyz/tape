import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { SEARCH_CHANNELS_QUERY } from '@utils/gql/queries'
import useDebounce from '@utils/hooks/useDebounce'
import useOutsideClick from '@utils/hooks/useOutsideClick'
import clsx from 'clsx'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'
import { Profile } from 'src/types'

export default function GlobalSearchBar() {
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

  const [searchChannels, { data: channels, loading }] = useLazyQuery(
    SEARCH_CHANNELS_QUERY
  )

  useEffect(() => {
    if (keyword.trim().length)
      searchChannels({
        variables: { request: { type: 'PROFILE', query: keyword, limit: 10 } }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  return (
    <div className="lg:w-96 md:w-80">
      <div>
        <div className="relative mt-1">
          <div className="relative w-full overflow-hidden border border-gray-200 cursor-default dark:border-gray-800 rounded-xl sm:text-sm">
            <input
              className="w-full py-2 pl-3 pr-10 text-sm bg-transparent focus:outline-none"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <AiOutlineSearch
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            onClick={() => setKeyword('')}
            ref={resultsRef}
            className={clsx(
              'absolute w-full mt-1 overflow-auto text-base bg-white dark:bg-[#181818] rounded-xl max-h-[80vh] ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            {channels?.search?.items.map((channel: Profile) => (
              <div
                key={channel.id}
                className="relative px-2 cursor-default select-none hover:bg-gray-100 dark:hover:bg-gray-900"
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
                            alt=""
                          />
                          <p className="text-base truncate line-clamp-1">
                            {channel.handle}
                          </p>
                        </div>
                        <span className="inline-flex items-center space-x-1 text-xs whitespace-nowrap opacity-60">
                          <BiUser />
                          <span>{channel.stats.totalFollowers}</span>
                        </span>
                      </span>
                      {channel.bio && (
                        <p className="text-sm truncate opacity-60">
                          {channel.bio}
                        </p>
                      )}
                    </a>
                  </Link>
                </>
              </div>
            ))}
            {!channels?.search?.items?.length && !loading && (
              <div className="relative px-4 text-center py-2.5 cursor-default select-none">
                No channels found.
              </div>
            )}
            {loading && (
              <div className="flex justify-center p-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
