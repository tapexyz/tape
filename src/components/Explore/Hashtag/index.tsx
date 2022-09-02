import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { SEARCH_VIDEOS_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import { LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom404 from 'src/pages/404'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const ExploreHashtag = () => {
  const { query } = useRouter()
  const hashtag = query.hashtag
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(SEARCH_VIDEOS_QUERY, {
    variables: {
      request: {
        query: hashtag,
        type: 'PUBLICATION',
        limit: 12,
        sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
      }
    },
    skip: !hashtag,
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
              query: hashtag,
              type: 'PUBLICATION',
              cursor: pageInfo?.next,
              limit: 12,
              sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
            }
          }
        })
        setPageInfo(data?.search?.pageInfo)
        setVideos([...videos, ...data?.search?.items])
      } catch (error) {
        logger.error('[Error Fetch Explore Hashtag]', error)
      }
    }
  })
  if (!hashtag) return <Custom404 />

  return (
    <>
      <MetaTags title={hashtag?.toString() || ''} />
      <div>
        <h1 className="font-semibold md:text-2xl">#{hashtag}</h1>
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

export default ExploreHashtag
