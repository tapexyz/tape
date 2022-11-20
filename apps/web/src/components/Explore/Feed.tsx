import CommentOutline from '@components/Common/Icons/CommentOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import type { LenstubePublication } from 'utils'
import {
  ADMIN_IDS,
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  TRACK
} from 'utils'

const initialCriteria = {
  trending: true,
  popular: false,
  interesting: false,
  recents: false
}

const ExploreFeed = () => {
  const [activeCriteria, setActiveCriteria] = useState(initialCriteria)

  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

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
    if (activeCriteria.recents) {
      return PublicationSortCriteria.Latest
    }
    return PublicationSortCriteria.TopCollected
  }

  const request = {
    sortCriteria: getCriteria(),
    limit: 32,
    noRandomize: true,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
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

  const videos = data?.explorePublications?.items as LenstubePublication[]
  const pageInfo = data?.explorePublications?.pageInfo

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
    <Tab.Group as="div" className="w-full col-span-9">
      <Tab.List className="flex overflow-x-auto no-scrollbar">
        <Tab
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Analytics.track('Pageview', {
              path: TRACK.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex whitespace-nowrap items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-900 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          <FireOutline className="w-3.5 h-3.5" />
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
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-900 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          <CommentOutline className="w-3.5 h-3.5" />
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
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected
                ? 'border-indigo-900 opacity-100'
                : 'border-transparent opacity-50'
            )
          }
        >
          <MirrorOutline className="w-3.5 h-3.5" />
          <span>Interesting</span>
        </Tab>
        {isAdmin && (
          <Tab
            onClick={() => {
              setActiveCriteria({
                ...initialCriteria,
                recents: true,
                trending: false
              })
              Analytics.track('Pageview', {
                path: TRACK.PAGE_VIEW.EXPLORE_RECENT
              })
            }}
            className={({ selected }) =>
              clsx(
                'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
                selected
                  ? 'border-indigo-900 opacity-100'
                  : 'border-transparent opacity-50'
              )
            }
          >
            <span>Recents</span>
          </Tab>
        )}
      </Tab.List>
      <Tab.Panels className="my-3">
        {loading && <TimelineShimmer />}
        {videos?.length === 0 && (
          <NoDataFound isCenter withImage text="No videos found" />
        )}
        {!error && !loading && (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
              <span ref={observe} className="flex justify-center p-10">
                <Loader />
              </span>
            )}
          </>
        )}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ExploreFeed
