import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Analytics, TRACK } from '@utils/analytics'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

const request = {
  sortCriteria: PublicationSortCriteria.Latest,
  limit: 30,
  noRandomize: true,
  sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  customFilters: LENS_CUSTOM_FILTERS
}

const Recents = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE_RECENT })
  }, [])

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
    <div>
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
    </div>
  )
}

export default Recents
