import type {
  ExplorePublicationRequest,
  MirrorablePublication
} from '@tape.xyz/lens'

import { SuggestedVideosShimmer } from '@components/Shimmers/WatchShimmer'
import useProfileStore from '@lib/store/idb/profile'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'

import SuggestedVideoCard from './SuggestedVideoCard'

const request: ExplorePublicationRequest = {
  limit: LimitType.Fifty,
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  where: {
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.Video],
      publishedOn: IS_MAINNET
        ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
        : undefined
    },
    publicationTypes: [ExplorePublicationType.Post]
  }
}

const SuggestedVideos = () => {
  const {
    query: { id }
  } = useRouter()

  const { activeProfile } = useProfileStore()

  const { data, error, fetchMore, loading, refetch } =
    useExplorePublicationsQuery({
      variables: {
        request
      }
    })

  const videos = data?.explorePublications
    ?.items as unknown as MirrorablePublication[]
  const pageInfo = data?.explorePublications?.pageInfo

  useEffect(() => {
    refetch()
  }, [id, refetch])

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          channelId: activeProfile?.id ?? null,
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  return (
    <>
      {loading && <SuggestedVideosShimmer />}
      {!error && !loading && videos.length ? (
        <div className="pb-3">
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 lg:flex lg:flex-col lg:gap-0">
            {videos?.map(
              (video) =>
                !video.isHidden &&
                video.id !== id && (
                  <SuggestedVideoCard key={video?.id} video={video} />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span className="flex justify-center p-10" ref={observe}>
              <Loader />
            </span>
          )}
        </div>
      ) : null}
    </>
  )
}

export default SuggestedVideos
