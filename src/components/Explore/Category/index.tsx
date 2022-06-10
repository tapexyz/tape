import { useQuery } from '@apollo/client'
import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { SEARCH_VIDEOS_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

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
        limit: 10,
        sources: [LENSTUBE_APP_ID]
      }
    },
    skip: !isReady,
    onCompleted(data) {
      setPageInfo(data?.search?.pageInfo)
      setVideos(data?.search?.items)
    }
  })

  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            query: categoryName,
            type: 'PUBLICATION',
            cursor: pageInfo?.next,
            limit: 10,
            sources: [LENSTUBE_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.search?.pageInfo)
        setVideos([...videos, ...data?.search?.items])
      })
    }
  })
  if (!query.category && isReady) return <Custom404 />

  return (
    <Layout>
      <MetaTags title={categoryName?.toString() || ''} />
      <div>
        <h1 className="font-semibold tracking-wide capitalize md:text-2xl">
          {categoryName}
        </h1>
        <div className="my-4">
          {loading && <TimelineShimmer />}
          {data?.search?.items?.length === 0 && (
            <NoDataFound text="No videos found." />
          )}
          {!error && !loading && (
            <>
              <Timeline videos={videos} />
              {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
                <span ref={observe} className="flex justify-center p-5">
                  <Loader />
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ExploreCategory
