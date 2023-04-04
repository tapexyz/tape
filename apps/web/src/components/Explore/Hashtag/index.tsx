import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import type { Publication } from 'lens'
import { SearchRequestTypes, useSearchPublicationsQuery } from 'lens'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import Custom404 from 'src/pages/404'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from 'utils'

const ExploreHashtag = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { query } = useRouter()
  const hashtag = query.hashtag as string

  const request = {
    type: SearchRequestTypes.Publication,
    limit: 32,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    query: hashtag
  }

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
    variables: {
      request
    },
    skip: !hashtag
  })

  const videos =
    data?.search.__typename === 'PublicationSearchResult'
      ? (data?.search?.items as Publication[])
      : []
  const pageInfo =
    data?.search.__typename === 'PublicationSearchResult'
      ? data?.search?.pageInfo
      : null

  usePaginationLoading({
    ref: sectionRef,
    hasMore: !!pageInfo?.next,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  if (!hashtag) {
    return <Custom404 />
  }

  return (
    <>
      <MetaTags title={hashtag?.toString()} />
      <div>
        <h1 className="font-semibold md:text-2xl">#{hashtag}</h1>
        <div ref={sectionRef} className="my-4">
          {loading && <TimelineShimmer />}
          {videos?.length === 0 && (
            <NoDataFound isCenter withImage text="No videos found" />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && (
                <span className="flex justify-center p-10">
                  <Loader />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ExploreHashtag
