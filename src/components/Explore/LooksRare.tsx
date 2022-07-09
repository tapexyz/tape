import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { EXPLORE_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const Timeline = dynamic(() => import('../Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const LooksRare = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: 'TOP_COLLECTED',
        limit: 12,
        noRandomize: true,
        sources: [LENSTUBE_APP_ID],
        publicationTypes: ['POST']
      }
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setVideos(data?.explorePublications?.items)
    }
  })

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            sortCriteria: 'TOP_COLLECTED',
            cursor: pageInfo?.next,
            limit: 8,
            noRandomize: true,
            sources: [LENSTUBE_APP_ID],
            publicationTypes: ['POST']
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.explorePublications?.pageInfo)
        setVideos([...videos, ...data?.explorePublications?.items])
      })
    }
  })
  return (
    <div>
      {loading && <TimelineShimmer />}
      {data?.explorePublications?.items.length === 0 && (
        <NoDataFound text="No videos found." />
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

export default LooksRare
