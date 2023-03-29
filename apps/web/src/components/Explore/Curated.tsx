import Timeline from '@components/Home/Timeline'
import CuratedCategoriesShimmer from '@components/Shimmers/CuratedCategoriesShimmer'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import axios from 'axios'
import clsx from 'clsx'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsLazyQuery
} from 'lens'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import useSWR from 'swr'
import {
  ALLOWED_APP_IDS,
  CURATED_CATEGORIES_URL,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from 'utils'

const Curated = () => {
  const [selectedCategory, setSelectedCategory] = useState('music')
  const [channelIds, setChannelIds] = useState<string[]>([])

  const request = {
    limit: 32,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const [getPosts, { data, loading, error, fetchMore }] =
    useProfilePostsLazyQuery()

  const videos = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            profileIds: channelIds,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  const onSelectCategory = async (category: string) => {
    setSelectedCategory(category)
    try {
      const result = await axios.get(`${CURATED_CATEGORIES_URL}/${category}`)
      const response = result.data
      const { channelIds } = response
      setChannelIds(channelIds)
      getPosts({
        variables: {
          request: { profileIds: channelIds, ...request }
        }
      })
    } catch {}
  }

  const { data: curatedData, isLoading } = useSWR(
    CURATED_CATEGORIES_URL,
    (url: string) => fetch(url).then((res) => res.json()),
    {
      onSuccess: () => onSelectCategory(selectedCategory),
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false
    }
  )
  const categories: string[] = curatedData?.categories ?? []

  const getDefaultTab = () => {
    return categories.length ? categories?.indexOf(selectedCategory) : 0
  }

  return (
    <Tab.Group as="div" className="w-full" defaultIndex={getDefaultTab()}>
      <Tab.List className="no-scrollbar flex space-x-2 overflow-x-auto pb-2">
        {isLoading && <CuratedCategoriesShimmer />}
        {categories?.map((category: string) => (
          <Tab
            key={category}
            onClick={() => onSelectCategory(category)}
            className={({ selected }) =>
              clsx(
                'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
                selected
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'hover:bg-gray-200 hover:dark:bg-gray-800'
              )
            }
          >
            <span className="uppercase">{category}</span>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="my-3">
        {loading && <TimelineShimmer />}
        {videos?.length === 0 && (
          <NoDataFound isCenter withImage text="No videos found" />
        )}
        {!error && !loading && videos?.length ? (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && (
              <span ref={observe} className="flex justify-center p-10">
                <Loader />
              </span>
            )}
          </>
        ) : null}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default Curated
