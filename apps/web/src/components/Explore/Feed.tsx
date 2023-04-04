import CommentOutline from '@components/Common/Icons/CommentOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React, { useRef, useState } from 'react'
import {
  ALLOWED_APP_IDS,
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'

const initialCriteria = {
  trending: true,
  popular: false,
  interesting: false
}

const ExploreFeed = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeCriteria, setActiveCriteria] = useState(initialCriteria)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const getCriteria = () => {
    if (activeCriteria.trending) {
      return PublicationSortCriteria.TopCollected
    }
    if (activeCriteria.popular) {
      return PublicationSortCriteria.TopCommented
    }
    if (activeCriteria.interesting) {
      return PublicationSortCriteria.TopMirrored
    }
    return PublicationSortCriteria.TopCollected
  }

  const request = {
    sortCriteria: getCriteria(),
    limit: 32,
    noRandomize: true,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { pageLoading } = usePaginationLoading({
    ref: sectionRef,
    hasMore: !!pageInfo?.next,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  return (
    <Tab.Group as="div" className="col-span-9 w-full">
      <Tab.List className="no-scrollbar flex overflow-x-auto">
        <Tab
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Analytics.track('Pageview', {
              path: TRACK.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-indigo-500' : 'border-transparent'
            )
          }
        >
          <FireOutline className="h-3.5 w-3.5" />
          <span>Trending</span>
        </Tab>
        <Tab
          onClick={() => {
            setActiveCriteria({
              ...initialCriteria,
              popular: true,
              trending: false
            })
            Analytics.track('Pageview', {
              path: TRACK.PAGE_VIEW.EXPLORE_POPULAR
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-indigo-500' : 'border-transparent'
            )
          }
        >
          <CommentOutline className="h-3.5 w-3.5" />
          <span>Popular</span>
        </Tab>
        <Tab
          onClick={() => {
            setActiveCriteria({
              ...initialCriteria,
              interesting: true,
              trending: false
            })
            Analytics.track('Pageview', {
              path: TRACK.PAGE_VIEW.EXPLORE_INTERESTING
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-indigo-500' : 'border-transparent'
            )
          }
        >
          <MirrorOutline className="h-3.5 w-3.5" />
          <span>Interesting</span>
        </Tab>
      </Tab.List>
      <Tab.Panels ref={sectionRef} className="my-3">
        {loading && <TimelineShimmer />}
        {videos?.length === 0 && (
          <NoDataFound isCenter withImage text="No videos found" />
        )}
        {!error && !loading && videos?.length ? (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && pageLoading && (
              <span className="flex justify-center p-10">
                <Loader />
              </span>
            )}
          </>
        ) : null}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ExploreFeed
