import { NoDataFound } from '@components/UIElements/NoDataFound'
import { useDebounce, useOutsideClick } from '@dragverse/browser'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID,
  TAPE_BYTES_APP_ID
} from '@dragverse/constants'
import { EVENTS, Tower } from '@dragverse/generic'
import type {
  PrimaryPublication,
  Profile,
  ProfileSearchRequest,
  PublicationSearchRequest
} from '@dragverse/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  SearchPublicationType,
  useSearchProfilesLazyQuery,
  useSearchPublicationsLazyQuery
} from '@dragverse/lens'
import { Loader } from '@dragverse/ui'
import { IconButton, ScrollArea, Text, TextField } from '@radix-ui/themes'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import SearchOutline from '../Icons/SearchOutline'
import Profiles from './Profiles'
import Publications from './Publications'

const GlobalSearch = () => {
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
        ],
        publishedOn: [
          TAPE_APP_ID,
          TAPE_BYTES_APP_ID,
          LENSTUBE_APP_ID,
          LENSTUBE_BYTES_APP_ID
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
      Tower.track(EVENTS.SEARCH)
    }
  }

  const profiles = profilesData?.searchProfiles?.items as Profile[]
  const publications = publicationsData?.searchPublications
    ?.items as unknown as PrimaryPublication[]

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const Trigger = () => (
    <IconButton
      onClick={() => setShowSearchBar(true)}
      radius="full"
      variant="soft"
      highContrast
    >
      <SearchOutline className="h-3.5 w-3.5" />
      <span className="sr-only">Search</span>
    </IconButton>
  )

  const Content = () => (
    <>
      <TextField.Root className="laptop:w-[800px] dark:bg-brand-850 bg-brand-50 z-20 w-[215px] rounded-full md:w-[500px] md:top-[100%]">
        <TextField.Slot px="3">
          <SearchOutline className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </TextField.Slot>
        <TextField.Input
          radius="full"
          autoFocus
          variant="surface"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search"
          className="text-base"
        />
      </TextField.Root>
      <div
        className={clsx(
          'rounded-medium tape-border dark:bg-brand-850 z-10 mt-1 w-[300px] bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none md:absolute md:w-[500px]',
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
                  <Text weight="bold">Creators</Text>
                  {profiles?.length ? (
                    <Profiles
                      results={profiles}
                      loading={profilesLoading}
                      clearSearch={() => setKeyword('')}
                    />
                  ) : (
                    <NoDataFound isCenter />
                  )}
                </div>
                <div className="space-y-2 focus:outline-none">
                  <Text weight="bold">Releases</Text>
                  {publications?.length ? (
                    <Publications
                      results={publications}
                      loading={publicationsLoading}
                      clearSearch={() => setKeyword('')}
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
  )

  return (
    <div>
      <div className="relative" ref={resultsRef}>
        {showSearchBar ? <Content /> : <Trigger />}
      </div>
    </div>
  )
}

export default GlobalSearch
