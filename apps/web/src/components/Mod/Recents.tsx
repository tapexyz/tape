import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { t } from '@lingui/macro'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Recents = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    limit: 32,
    noRandomize: true,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
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
  if (loading) {
    return (
      <div className="pt-9">
        <TimelineShimmer />
      </div>
    )
  }
  if (!videos.length || error) {
    return <NoDataFound isCenter withImage text={t`No videos found`} />
  }

  return (
    <div className="pt-9">
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
  )
}

export default Recents
