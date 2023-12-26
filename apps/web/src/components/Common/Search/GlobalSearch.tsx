import type {
  PrimaryPublication,
  Profile,
  ProfileSearchRequest,
  PublicationSearchRequest
} from '@tape.xyz/lens'

import { NoDataFound } from '@components/UIElements/NoDataFound'
import { IconButton, ScrollArea, Text, TextField } from '@radix-ui/themes'
import { useDebounce, useOutsideClick } from '@tape.xyz/browser'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  SearchPublicationType,
  useSearchProfilesLazyQuery,
  useSearchPublicationsLazyQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'

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
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.ShortVideo
        ],
        publishedOn: [TAPE_APP_ID, LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
      },
      publicationTypes: [SearchPublicationType.Post]
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
      highContrast
      onClick={() => setShowSearchBar(true)}
      radius="full"
      variant="soft"
    >
      <SearchOutline className="size-3.5" />
      <span className="sr-only">Search</span>
    </IconButton>
  )

  const Content = () => (
    <>
      <TextField.Root className="laptop:w-[800px] absolute z-20 hidden w-[500px] rounded-full bg-white dark:bg-black">
        <TextField.Slot px="3">
          <SearchOutline className="size-4" />
          <span className="sr-only">Search</span>
        </TextField.Slot>
        <TextField.Input
          autoFocus
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search"
          radius="full"
          type="search"
          value={keyword}
          variant="surface"
        />
      </TextField.Root>
      <div
        className={clsx(
          'rounded-medium tape-border z-10 mt-1 w-full bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black md:absolute',
          { hidden: debouncedValue.length === 0 }
        )}
      >
        <ScrollArea
          scrollbars="vertical"
          style={{ maxHeight: '80vh' }}
          type="hover"
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
                      clearSearch={() => setKeyword('')}
                      loading={profilesLoading}
                      results={profiles}
                    />
                  ) : (
                    <NoDataFound isCenter />
                  )}
                </div>
                <div className="space-y-2 focus:outline-none">
                  <Text weight="bold">Releases</Text>
                  {publications?.length ? (
                    <Publications
                      clearSearch={() => setKeyword('')}
                      loading={publicationsLoading}
                      results={publications}
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
      <div className="relative hidden md:block" ref={resultsRef}>
        {showSearchBar ? <Content /> : <Trigger />}
      </div>
    </div>
  )
}

export default GlobalSearch
