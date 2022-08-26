import { useQuery } from '@apollo/client'
import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import { EXPLORE_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import SuggestedVideoCard from './SuggestedVideoCard'

type Props = {
  currentVideoId: string
}

const SuggestedVideos: FC<Props> = ({ currentVideoId }) => {
  const {
    query: { id }
  } = useRouter()
  const setUpNextVideo = useAppStore((state) => state.setUpNextVideo)

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
      setUpNextVideo(
        data?.explorePublications?.items?.find(
          (video: LenstubePublication) => video.id !== currentVideoId
        )
      )
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
        logger.error('[Error Fetch Suggested Videos]', error)
      }
    }
  })

  return (
    <>
      {loading && <SuggestedVideosShimmer />}
      {!error && !loading && (
        <div className="pb-3">
          <div className="space-y-3 md:gap-3 md:grid lg:flex lg:gap-0 lg:flex-col md:grid-cols-2">
            {videos?.map(
              (video: LenstubePublication) =>
                !video.hidden && (
                  <SuggestedVideoCard
                    video={video}
                    key={`${video?.id}_${video.createdAt}`}
                  />
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
