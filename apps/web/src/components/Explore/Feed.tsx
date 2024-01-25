import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import useAppStore from '@lib/store'
import { tw } from '@tape.xyz/browser'
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
import {
  Button,
  CommentOutline,
  FireOutline,
  MirrorOutline,
  Spinner
} from '@tape.xyz/ui'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'

const initialCriteria = {
  trending: true,
  popular: false,
  interesting: false
}

const since = getUnixTimestampForDaysAgo(30)

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
      },
      since
    },
    orderBy: getCriteria(),
    limit: LimitType.Fifty
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
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          className={tw(activeCriteria.trending && 'border-brand-500')}
          onClick={() => {
            setActiveCriteria({ ...initialCriteria })
            Tower.track(EVENTS.PAGEVIEW, {
              page: EVENTS.PAGE_VIEW.EXPLORE_TRENDING
            })
          }}
          icon={<FireOutline className="size-5" />}
        >
          Trending
        </Button>
        <Button
          variant="secondary"
          className={tw(activeCriteria.popular && 'border-brand-500')}
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
          icon={<CommentOutline className="size-5" />}
        >
          Popular
        </Button>
        <Button
          variant="secondary"
          className={tw(activeCriteria.interesting && 'border-brand-500')}
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
          icon={<MirrorOutline className="size-5" />}
        >
          Interesting
        </Button>
      </div>

      <div className="my-4">
        {loading && <TimelineShimmer />}
        {videos?.length === 0 && (
          <NoDataFound isCenter withImage text="No videos found" />
        )}
        {!error && !loading && videos?.length ? (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && (
              <span ref={observe} className="flex justify-center p-10">
                <Spinner />
              </span>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ExploreFeed
