import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { EXPLORE_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import { PaginatedResultInfo, PublicationTypes } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const ExploreCategory = () => {
  const { query } = useRouter()
  const categoryName = query.category
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        metadata: { tags: { all: [query.category] } },
        publicationTypes: [PublicationTypes.Post],
        limit: 12,
        sources: [LENSTUBE_APP_ID],
        sortCriteria: 'TOP_COLLECTED'
      }
    },
    skip: !query.category,
    onCompleted(data) {
      setPageInfo(data?.search?.pageInfo)
      setVideos(data?.search?.items)
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              metadata: { tags: { all: [query.category] } },
              publicationTypes: [PublicationTypes.Post],
              limit: 12,
              sources: [LENSTUBE_APP_ID],
              sortCriteria: 'TOP_COLLECTED'
            }
          }
        })
        setPageInfo(data?.search?.pageInfo)
        setVideos([...videos, ...data?.search?.items])
      } catch (error) {
        logger.error('[Error Fetch Explore Category]', error)
      }
    }
  })
  if (!query.category) return <Custom404 />

  return (
    <>
      <MetaTags title={categoryName?.toString() || ''} />
      <div>
        <h1 className="font-semibold capitalize md:text-2xl">{categoryName}</h1>
        <div className="my-4">
          {loading && <TimelineShimmer />}
          {data?.search?.items?.length === 0 && (
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
      </div>
    </>
  )
}

export default ExploreCategory
