import { Tab } from '@headlessui/react'
import { Analytics, TRACK, useOutsideClick } from '@lenstube/browser'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@lenstube/constants'
import { useDebounce } from '@lenstube/generic'
import type { AnyPublication, Profile } from '@lenstube/lens'
import {
  SearchProfilesDocument,
  SearchPublicationsDocument
} from '@lenstube/lens'
import { useLazyQuery } from '@lenstube/lens/apollo'
import { Loader } from '@lenstube/ui'
import { t, Trans } from '@lingui/macro'
import { TextField } from '@radix-ui/themes'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import SearchOutline from '../Icons/SearchOutline'
import Channels from './Channels'
import Videos from './Videos'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
  const [activeSearch, setActiveSearch] = useState<'PROFILE' | 'PUBLICATION'>(
    'PROFILE'
  )
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
            sources: IS_MAINNET
              ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
              : undefined,
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      })
      Analytics.track(
        TRACK.SEARCH,
        activeSearch === 'PROFILE' ? { channel: true } : { video: true }
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
          <TextField.Root variant="soft" color="gray">
            <TextField.Slot>
              <SearchOutline className="h-3 w-3" />
            </TextField.Slot>
            <TextField.Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t`Search`}
            />
          </TextField.Root>
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
                    setActiveSearch('PROFILE')
                  }}
                >
                  <Trans>Channels</Trans>
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
                    setActiveSearch('PUBLICATION')
                  }}
                >
                  <Trans>Videos</Trans>
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
                      results={channels as AnyPublication[]}
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
