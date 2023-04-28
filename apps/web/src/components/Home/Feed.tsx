import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { t } from '@lingui/macro'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import React from 'react'
import { useInView } from 'react-cool-inview'
import {
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  SCROLL_ROOT_MARGIN
} from 'utils'

const HomeFeed = () => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    sources: [LENSTUBE_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useExploreQuery({
    variables: { request }
  })

  const pageInfo = data?.explorePublications?.pageInfo
  const videos = data?.explorePublications?.items as Publication[]

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

  if (videos?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No videos found`} />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && videos && (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default HomeFeed
