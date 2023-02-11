import { SuggestedVideosShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Loader } from '@components/UIElements/Loader'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import {
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from 'utils'

import SuggestedVideoCard from './SuggestedVideoCard'

const request = {
  sortCriteria: PublicationSortCriteria.CuratedProfiles,
  limit: 30,
  sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
  publicationTypes: [PublicationTypes.Post],
  metadata: { mainContentFocus: [PublicationMainFocus.Video] },
  noRandomize: false,
  customFilters: LENS_CUSTOM_FILTERS
}

const SuggestedVideos: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const {
    query: { id }
  } = useRouter()
  const { data, loading, error, fetchMore, refetch } = useExploreQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  useEffect(() => {
    refetch()
  }, [id, refetch])

  usePaginationLoading({
    ref: sectionRef,
    fetch: async () =>
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
  })

  return (
    <>
      {loading && <SuggestedVideosShimmer />}
      {!error && !loading && videos.length ? (
        <div className="pb-3">
          <div
            ref={sectionRef}
            className="space-y-3 md:grid md:grid-cols-2 md:gap-3 lg:flex lg:flex-col lg:gap-0"
            data-testid="watch-video-suggestions"
          >
            {videos?.map(
              (video: Publication) =>
                !video.hidden &&
                video.id !== id && (
                  <SuggestedVideoCard video={video} key={video?.id} />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      ) : null}
    </>
  )
}

export default SuggestedVideos
