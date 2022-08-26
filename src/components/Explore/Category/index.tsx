import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { SEARCH_VIDEOS_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import { LENSTUBE_APP_ID } from '@utils/constants'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const Timeline = dynamic(() => import('../../Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const ExploreCategory = () => {
  const { query, isReady } = useRouter()
  const categoryName = query.category
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(SEARCH_VIDEOS_QUERY, {
    variables: {
      request: {
        query: categoryName,
        type: 'PUBLICATION',
        limit: 8,
        sources: [LENSTUBE_APP_ID]
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
              query: categoryName,
              type: 'PUBLICATION',
              cursor: pageInfo?.next,
              limit: 8,
              sources: [LENSTUBE_APP_ID]
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
  if (!query.category && isReady) return <Custom404 />

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
