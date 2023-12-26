import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

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
  interesting: false,
  popular: false,
  trending: true
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
    limit: LimitType.Fifty,
    orderBy: getCriteria(),
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined,
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined
      },
      publicationTypes: [ExplorePublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading } = useExplorePublicationsQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  return (
    <div className="laptop:pt-6 pt-4">
      <div className="space-x-2">
        <Button
          highContrast
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
          radius="full"
          variant={activeCriteria.trending ? 'solid' : 'surface'}
        >
          <span className="flex items-center space-x-1">
            <FireOutline className="size-3.5" />
            <span>Trending</span>
          </span>
        </Button>
        <Button
          highContrast
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
          radius="full"
          variant={activeCriteria.popular ? 'solid' : 'surface'}
        >
          <span className="flex items-center space-x-1">
            <CommentOutline className="size-3.5" />
            <span>Popular</span>
          </span>
        </Button>
        <Button
          highContrast
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
          radius="full"
          variant={activeCriteria.interesting ? 'solid' : 'surface'}
        >
          <span className="flex items-center space-x-1">
            <MirrorOutline className="size-3.5" />
            <span>Interesting</span>
          </span>
        </Button>
      </div>

      <div className="my-4">
        {loading && <TimelineShimmer />}
        {videos?.length === 0 && (
          <NoDataFound isCenter text={`No videos found`} withImage />
        )}
        {!error && !loading && videos?.length ? (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && (
              <span className="flex justify-center p-10" ref={observe}>
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
