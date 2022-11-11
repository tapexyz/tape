import { useQuery } from '@apollo/client'
import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  ExploreDocument,
  PaginatedResultInfo,
  PublicationSortCriteria,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

import SuggestedVideoCard from './SuggestedVideoCard'

type Props = {
  currentVideoId: string
}

const request = {
  sortCriteria: PublicationSortCriteria.TopCommented,
  limit: 16,
  sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  noRandomize: false,
  customFilters: LENS_CUSTOM_FILTERS
}

const SuggestedVideos: FC<Props> = ({ currentVideoId }) => {
  const {
    query: { id }
  } = useRouter()
  const setUpNextVideo = useAppStore((state) => state.setUpNextVideo)

  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { loading, error, fetchMore, refetch } = useQuery(ExploreDocument, {
    variables: {
      request
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      const publications = data?.explorePublications
        ?.items as LenstubePublication[]
      setVideos(publications)
      setUpNextVideo(
        publications?.find(
          (video: LenstubePublication) => video.id !== currentVideoId
        ) as LenstubePublication
      )
    }
  })

  useEffect(() => {
    refetch()
  }, [id, refetch])

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.explorePublications?.pageInfo)
        setVideos([
          ...videos,
          ...(data?.explorePublications?.items as LenstubePublication[])
        ])
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
                  <SuggestedVideoCard video={video} key={video?.id} />
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
