import { NoDataFound } from '@components/UIElements/NoDataFound'
import { IconButton, ScrollArea, Text, TextField } from '@radix-ui/themes'
import { useDebounce, useOutsideClick } from '@tape.xyz/browser'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
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
      <TextField.Root className="laptop:w-[800px] absolute z-20 hidden w-[500px] rounded-full bg-white dark:bg-black">
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
        />
      </TextField.Root>
      <div
        className={clsx(
          'rounded-medium tape-border z-10 mt-1 w-full bg-white text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black md:absolute',
          { hidden: debouncedValue.length === 0 }
        )}
      >
        <ScrollArea
          type="hover"
          style={{ maxHeight: '80vh', display: 'block' }}
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
      <div className="relative hidden md:block" ref={resultsRef}>
        {showSearchBar ? <Content /> : <Trigger />}
      </div>
    </div>
  )
}

export default GlobalSearch
