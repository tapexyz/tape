import CommentOutline from '@components/Common/Icons/CommentOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from 'lens'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from 'utils'

const initialCriteria = {
  podcasts: true,
  tutorials: false
}

const Recommended = () => {
  const [activeCriteria, setActiveCriteria] = useState(initialCriteria)

  const request = {
    limit: 32,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    },
    profileId: '0x2d'
  }

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: {
      request
    }
  })

  const videos = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <Tab.Group as="div" className="col-span-9 w-full">
      <Tab.List className="no-scrollbar flex space-x-2 overflow-x-auto pb-2">
        <Tab
          onClick={() => setActiveCriteria({ ...initialCriteria })}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <FireOutline className="h-3.5 w-3.5" />
          <span>For you</span>
        </Tab>
        <Tab
          onClick={() =>
            setActiveCriteria({
              ...initialCriteria
            })
          }
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <CommentOutline className="h-3.5 w-3.5" />
          <span>Popular</span>
        </Tab>
        <Tab
          onClick={() =>
            setActiveCriteria({
              ...initialCriteria
            })
          }
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase transition duration-300 ease-in-out focus:outline-none',
              selected
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-200 hover:dark:bg-gray-800'
            )
          }
        >
          <MirrorOutline className="h-3.5 w-3.5" />
          <span>Interesting</span>
        </Tab>
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

export default Recommended
