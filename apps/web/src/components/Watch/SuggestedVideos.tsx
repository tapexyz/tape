import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'
import type { LenstubePublication } from 'utils'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from 'utils'

import SuggestedVideoCard from './SuggestedVideoCard'

type Props = {
  currentVideoId: string
}

const request = {
  sortCriteria: PublicationSortCriteria.TopCommented,
  limit: 30,
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

  const { data, loading, error, fetchMore, refetch } = useExploreQuery({
    variables: {
      request
    },
    onCompleted: (data) => {
      const publications = data?.explorePublications
        ?.items as LenstubePublication[]
      setUpNextVideo(
        publications?.find(
          (video: LenstubePublication) => video.id !== currentVideoId
        ) as LenstubePublication
      )
    }
  })

  const videos = data?.explorePublications?.items as LenstubePublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  useEffect(() => {
    refetch()
  }, [id, refetch])

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <>
      {loading && <SuggestedVideosShimmer />}
      {!error && !loading && videos.length && (
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
