import CommentOutline from '@components/Common/Icons/CommentOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

const initialCriteria = {
  trending: true,
  popular: false,
  interesting: false
}

const ExploreFeed = () => {
  const [activeCriteria, setActiveCriteria] = useState(initialCriteria)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const getCriteria = () => {
    if (activeCriteria.trending) {
      return ExplorePublicationsOrderByType.TopCollectedOpenAction
    }
    if (activeCriteria.popular) {
      return ExplorePublicationsOrderByType.TopCommented
    }
    if (activeCriteria.interesting) {
      return ExplorePublicationsOrderByType.TopMirrored
    }
    return ExplorePublicationsOrderByType.TopCollectedOpenAction
  }

  const request: ExplorePublicationRequest = {
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      publicationTypes: [ExplorePublicationType.Post],
      metadata: {
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined
      }
    },
    orderBy: getCriteria(),
    limit: LimitType.TwentyFive
  }

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          },
          channelId: selectedSimpleProfile?.id ?? null
        }
      })
    }
  })

  return (
    <Tab.Group as="div" className="col-span-9 w-full">
      <Tab.List className="no-scrollbar flex overflow-x-auto">
        <Tab
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 whitespace-nowrap border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-brand-500' : 'border-transparent'
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
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_POPULAR
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-brand-500' : 'border-transparent'
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
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_INTERESTING
            })
          }}
          className={({ selected }) =>
            clsx(
              'flex items-center space-x-2 border-b-2 px-4 py-2 focus:outline-none',
              selected ? 'border-brand-500' : 'border-transparent'
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
          <NoDataFound isCenter withImage text={`No videos found`} />
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

export default ExploreFeed
