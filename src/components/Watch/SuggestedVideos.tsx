import { useQuery } from '@apollo/client'
import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { EXPLORE_QUERY } from '@utils/gql/queries'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import SuggestedVideoCard from './SuggestedVideoCard'

const SuggestedVideos = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { loading, error, fetchMore } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: 'LATEST',
        limit: 10,
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
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            sortCriteria: 'LATEST',
            limit: 10,
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
  if (loading) {
    return <SuggestedVideosShimmer />
  }

  return (
    <>
      {!error && !loading && (
        <div className="pb-3">
          <div className="space-y-3 md:gap-3 md:grid lg:flex lg:gap-0 lg:flex-col md:grid-cols-2">
            {videos?.map((video: LenstubePublication, index: number) => (
              <SuggestedVideoCard video={video} key={index} />
            ))}
          </div>
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default SuggestedVideos
