import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import { IconButton, ScrollArea, Text, TextField } from '@radix-ui/themes'
import {
  Analytics,
  TRACK,
  useDebounce,
  useOutsideClick
} from '@tape.xyz/browser'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import type {
  PrimaryPublication,
  Profile,
  ProfileSearchRequest,
  PublicationSearchRequest
} from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  SearchPublicationType,
  useSearchProfilesLazyQuery,
  useSearchPublicationsLazyQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import SearchOutline from '../Icons/SearchOutline'
import Profiles from './Profiles'
import Publications from './Publications'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearch: FC<Props> = ({ onSearchResults }) => {
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [keyword, setKeyword] = useState('')

  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => {
    setKeyword('')
    setShowSearchBar(false)
  })

  const [
    searchPublications,
    { data: publicationsData, loading: publicationsLoading }
  ] = useSearchPublicationsLazyQuery()

  const [searchProfiles, { data: profilesData, loading: profilesLoading }] =
    useSearchProfilesLazyQuery()

  const publicationSearchRequest: PublicationSearchRequest = {
    limit: LimitType.Ten,
    query: keyword,
    where: {
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.ShortVideo
        ]
      },
      publicationTypes: [SearchPublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const profileSearchRequest: ProfileSearchRequest = {
    limit: LimitType.Ten,
    query: keyword,
    where: {
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const onDebounce = () => {
    if (keyword.trim().length) {
      searchPublications({
        variables: {
          request: publicationSearchRequest
        }
      })
      searchProfiles({
        variables: {
          request: profileSearchRequest
        }
      })
      Analytics.track(TRACK.SEARCH)
    }
  }

  const profiles = profilesData?.searchProfiles?.items as Profile[]
  const publications = publicationsData?.searchPublications
    ?.items as unknown as PrimaryPublication[]

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const clearSearch = () => {
    setKeyword('')
    onSearchResults?.()
  }

  return (
    <div ref={resultsRef}>
      <div className="relative">
        {showSearchBar ? (
          <>
            <TextField.Root className="dark:bg-bunker absolute z-20 w-[250px] rounded-md bg-white lg:w-[800px]">
              <TextField.Slot px="3">
                <SearchOutline className="h-4 w-4" />
              </TextField.Slot>
              <TextField.Input
                autoFocus
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t`Search`}
              />
            </TextField.Root>
            <div
              className={clsx(
                'dark:bg-bunker rounded-small z-10 mt-1 w-full border bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-700 md:absolute',
                { hidden: debouncedValue.length === 0 }
              )}
            >
              <ScrollArea
                type="hover"
                style={{ maxHeight: '80vh' }}
                scrollbars="vertical"
              >
                <div className="p-4">
                  {profilesLoading || publicationsLoading ? (
                    <div className="flex justify-center p-5">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 pb-2 focus:outline-none">
                        <Text size="3" weight="bold">
                          Creators
                        </Text>
                        {profiles?.length ? (
                          <Profiles
                            results={profiles}
                            loading={profilesLoading}
                            clearSearch={clearSearch}
                          />
                        ) : (
                          <NoDataFound isCenter />
                        )}
                      </div>
                      <div className="space-y-2 focus:outline-none">
                        <Text size="3" weight="bold">
                          Releases
                        </Text>
                        {publications?.length ? (
                          <Publications
                            results={publications}
                            loading={publicationsLoading}
                            clearSearch={clearSearch}
                          />
                        ) : (
                          <NoDataFound isCenter />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <IconButton
            onClick={() => setShowSearchBar(true)}
            radius="full"
            variant="soft"
          >
            <SearchOutline className="h-3.5 w-3.5" />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default GlobalSearch
