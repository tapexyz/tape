import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'

import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
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

const request: ExplorePublicationRequest = {
  limit: LimitType.Fifty,
  orderBy: ExplorePublicationsOrderByType.Latest,
  where: {
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.Video],
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
    },
    publicationTypes: [ExplorePublicationType.Post]
  }
}

const Recents = () => {
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
  if (loading) {
    return (
      <div className="pt-3">
        <TimelineShimmer />
      </div>
    )
  }
  if (!videos.length || error) {
    return <NoDataFound isCenter text={`No videos found`} withImage />
  }

  return (
    <div className="pt-3">
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
  )
}

export default Recents
