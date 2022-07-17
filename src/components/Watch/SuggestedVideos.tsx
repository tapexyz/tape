import { useQuery } from '@apollo/client'
import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { EXPLORE_QUERY } from '@utils/gql/queries'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import SuggestedVideoCard from './SuggestedVideoCard'

const SuggestedVideos = () => {
  const {
    query: { id }
  } = useRouter()
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { loading, error, fetchMore, refetch } = useQuery(EXPLORE_QUERY, {
    variables: {
      request: {
        sortCriteria: 'LATEST',
        limit: 12,
        sources: [LENSTUBE_APP_ID],
        publicationTypes: ['POST'],
        noRandomize: false
      }
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setVideos(data?.explorePublications?.items)
    }
  })

  useEffect(() => {
    refetch()
  }, [id, refetch])

  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              cursor: pageInfo?.next,
              sortCriteria: 'LATEST',
              limit: 16,
              sources: [LENSTUBE_APP_ID],
              publicationTypes: ['POST'],
              noRandomize: false
            }
          }
        })
        setPageInfo(data?.explorePublications?.pageInfo)
        setVideos([...videos, ...data?.explorePublications?.items])
      } catch (error) {
        console.log(error)
      }
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
            {videos?.map(
              (video: LenstubePublication, index: number) =>
                !video.hidden && (
                  <SuggestedVideoCard video={video} key={index} />
                )
            )}
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
