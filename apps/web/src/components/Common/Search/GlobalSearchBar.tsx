import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Analytics, TRACK, useOutsideClick } from '@lenstube/browser'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { useDebounce } from '@lenstube/generic'
import type {
  PrimaryPublication,
  Profile,
  ProfileSearchRequest,
  PublicationSearchRequest
} from '@lenstube/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  useSearchProfilesLazyQuery,
  useSearchPublicationsLazyQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import { t } from '@lingui/macro'
import { Box, Text, TextField } from '@radix-ui/themes'
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
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

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
    <div className="md:w-2/4" data-testid="global-search">
      <div ref={resultsRef}>
        <div className="relative">
          <TextField.Root variant="soft" color="gray">
            <TextField.Slot>
              <SearchOutline className="h-3 w-3" />
            </TextField.Slot>
            <TextField.Input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t`Search`}
            />
          </TextField.Root>
          <div
            className={clsx(
              'dark:bg-theme z-10 mt-1 w-full overflow-hidden rounded-md bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:absolute',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            <div
              className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none"
              data-testid="search-channels-panel"
            >
              <Box p="4">
                <Text size="3" weight="medium">
                  Creators
                </Text>
              </Box>
              {profiles?.length ? (
                <Channels
                  results={profiles}
                  loading={profilesLoading}
                  clearSearch={clearSearch}
                />
              ) : (
                <NoDataFound withImage isCenter />
              )}
            </div>
            <div className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none">
              <Box p="4">
                <Text size="3" weight="medium">
                  Releases
                </Text>
              </Box>
              {publications?.length ? (
                <Videos
                  results={publications}
                  loading={publicationsLoading}
                  clearSearch={clearSearch}
                />
              ) : (
                <NoDataFound withImage isCenter />
              )}
            </div>

            {profilesLoading || publicationsLoading ? (
              <div className="flex justify-center p-5">
                <Loader />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearchBar
