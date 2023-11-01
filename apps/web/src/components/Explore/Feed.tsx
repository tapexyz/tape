import CommentOutline from '@components/Common/Icons/CommentOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { Button } from '@radix-ui/themes'
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
          }
        }
      })
    }
  })

  return (
    <div className="laptop:pt-6 pt-4">
      <div className="space-x-2">
        <Button
          radius="full"
          highContrast
          variant={activeCriteria.trending ? 'solid' : 'surface'}
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
        >
          <span className="flex items-center space-x-1">
            <FireOutline className="h-3.5 w-3.5" />
            <span>Trending</span>
          </span>
        </Button>
        <Button
          radius="full"
          highContrast
          variant={activeCriteria.popular ? 'solid' : 'surface'}
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
        >
          <span className="flex items-center space-x-1">
            <CommentOutline className="h-3.5 w-3.5" />
            <span>Popular</span>
          </span>
        </Button>
        <Button
          radius="full"
          highContrast
          variant={activeCriteria.interesting ? 'solid' : 'surface'}
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
        >
          <span className="flex items-center space-x-1">
            <MirrorOutline className="h-3.5 w-3.5" />
            <span>Interesting</span>
          </span>
        </Button>
      </div>

      <div className="my-4">
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
      </div>
    </div>
  )
}

export default ExploreFeed
