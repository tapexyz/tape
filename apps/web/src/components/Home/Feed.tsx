import CategoryFilters from '@components/Common/CategoryFilters'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@lenstube/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAppStore from '@lib/store'
import { t } from '@lingui/macro'
import React from 'react'
import { useInView } from 'react-cool-inview'

import BytesSection from './BytesSection'

const HomeFeed = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        publishedOn: IS_MAINNET
          ? [LENSTUBE_APP_ID, ...ALLOWED_APP_IDS]
          : undefined,
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
        mainContentFocus: [PublicationMetadataMainFocusType.Video]
      }
    },
    orderBy: ExplorePublicationsOrderByType.LensCurated,
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]

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
    <div>
      <CategoryFilters />
      <BytesSection />
      {loading && <TimelineShimmer />}
      {!error && !loading && videos.length > 0 && (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
      {videos?.length === 0 && (
        <NoDataFound isCenter withImage text={t`No videos found`} />
      )}
    </div>
  )
}

export default HomeFeed
