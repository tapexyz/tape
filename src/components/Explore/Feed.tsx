import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/ui/Loader'
import { NoDataFound } from '@components/ui/NoDataFound'
import { LENSTUBE_VIDEOS_APP_ID } from '@utils/constants'
import { EXPLORE_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const Timeline = dynamic(() => import('../../components/Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const ExploreFeed = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: 'LATEST',
        limit: 10,
        noRandomize: true,
        sources: [LENSTUBE_VIDEOS_APP_ID],
        publicationTypes: ['POST']
      }
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setVideos(data?.explorePublications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 0.7,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            sortCriteria: 'LATEST',
            cursor: pageInfo?.next,
            limit: 10,
            noRandomize: true,
            sources: [LENSTUBE_VIDEOS_APP_ID],
            publicationTypes: ['POST']
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.explorePublications?.pageInfo)
        setVideos([...videos, ...data?.explorePublications?.items])
      })
    }
  })

  if (data?.length === 0) {
    return <NoDataFound text="No videos found." />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
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
  )
}

export default ExploreFeed
