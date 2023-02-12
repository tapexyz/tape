import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Profile, Publication } from 'lens'
import {
  SearchProfilesDocument,
  SearchPublicationsDocument,
  SearchRequestTypes
} from 'lens'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import {
  ALLOWED_APP_IDS,
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'
import useDebounce from 'utils/hooks/useDebounce'
import useOutsideClick from 'utils/hooks/useOutsideClick'

import SearchOutline from '../Icons/SearchOutline'
import Channels from './Channels'
import Videos from './Videos'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
  const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile)
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

  const [searchChannels, { data, loading }] = useLazyQuery(
    activeSearch === 'PROFILE'
      ? SearchProfilesDocument
      : SearchPublicationsDocument
  )

  const onDebounce = () => {
    if (keyword.trim().length) {
      searchChannels({
        variables: {
          request: {
            type: activeSearch,
            query: keyword,
            limit: 30,
            sources: [
              LENSTUBE_APP_ID,
              LENSTUBE_BYTES_APP_ID,
              ...ALLOWED_APP_IDS
            ],
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      })
      Analytics.track(
        activeSearch === 'PROFILE' ? TRACK.SEARCH_CHANNELS : TRACK.SEARCH_VIDEOS
      )
    }
  }

  const channels = data?.search?.items

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, activeSearch])

  const clearSearch = () => {
    setKeyword('')
    onSearchResults?.()
  }

  return (
    <div className="md:w-96" data-testid="global-search">
      <div ref={resultsRef}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:text-sm">
            <input
              className="w-full bg-transparent py-2 pl-4 pr-10 text-sm focus:outline-none"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by channel / hashtag"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchOutline
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className={clsx(
              'dark:bg-theme z-10 mt-1 w-full overflow-hidden rounded-xl bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:absolute',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            <Tab.Group>
              <Tab.List className="flex justify-center">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full border-b-2 px-4 py-2 text-sm focus:outline-none',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch(SearchRequestTypes.Profile)
                  }}
                >
                  Channels
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full border-b-2 px-4 py-2 text-sm focus:outline-none',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch(SearchRequestTypes.Publication)
                  }}
                >
                  Videos
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel
                  className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none"
                  data-testid="search-channels-panel"
                >
                  {data?.search?.__typename === 'ProfileSearchResult' && (
                    <Channels
                      results={channels as Profile[]}
                      loading={loading}
                      clearSearch={clearSearch}
                    />
                  )}
                </Tab.Panel>
                <Tab.Panel className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none">
                  {data?.search?.__typename === 'PublicationSearchResult' && (
                    <Videos
                      results={channels as Publication[]}
                      loading={loading}
                      clearSearch={clearSearch}
                    />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {loading && (
              <div className="flex justify-center p-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default GlobalSearchBar
