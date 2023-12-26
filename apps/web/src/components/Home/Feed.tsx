import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

import CategoryFilters from '@components/Common/CategoryFilters'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Feed = ({ showFilter = true }) => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request: ExplorePublicationRequest = {
    limit: LimitType.Fifty,
    orderBy: ExplorePublicationsOrderByType.LensCurated,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined,
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined
      },
      publicationTypes: [ExplorePublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading } = useExplorePublicationsQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]

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
    <div className="laptop:pt-6 space-y-4 pt-4">
      {showFilter && (
        <div>
          <CategoryFilters />
        </div>
      )}
      <div>
        {loading && <TimelineShimmer />}
        {!error && !loading && videos.length > 0 && (
          <>
            <Timeline videos={videos} />
            {pageInfo?.next && (
              <span className="flex justify-center p-10" ref={observe}>
                <Loader />
              </span>
            )}
          </>
        )}
        {videos?.length === 0 && (
          <NoDataFound isCenter text={`No videos found`} withImage />
        )}
      </div>
    </div>
  )
}

export default Feed
