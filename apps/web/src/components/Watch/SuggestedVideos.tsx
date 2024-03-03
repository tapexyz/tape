import { SuggestedVideosShimmer } from '@components/Shimmers/WatchShimmer'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import useProfileStore from '@lib/store/idb/profile'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type {
  ExplorePublicationRequest,
  MirrorablePublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'

import SuggestedVideoCard from './SuggestedVideoCard'

const since = getUnixTimestampForDaysAgo(30)

const request: ExplorePublicationRequest = {
  limit: LimitType.Fifty,
  orderBy: ExplorePublicationsOrderByType.TopReacted,
  where: {
    customFilters: LENS_CUSTOM_FILTERS,
    publicationTypes: [ExplorePublicationType.Post],
    metadata: {
      publishedOn: IS_MAINNET
        ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
        : undefined,
      mainContentFocus: [PublicationMetadataMainFocusType.Video]
    },
    since
  }
}

const SuggestedVideos = () => {
  const {
    query: { id }
  } = useRouter()

  const { activeProfile } = useProfileStore()

  const { data, loading, error, fetchMore, refetch } =
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
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          },
          channelId: activeProfile?.id ?? null
        }
      })
    }
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
                  <SuggestedVideoCard video={video} key={video?.id} />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Spinner />
            </span>
          )}
        </div>
      ) : null}
    </>
  )
}

export default SuggestedVideos
