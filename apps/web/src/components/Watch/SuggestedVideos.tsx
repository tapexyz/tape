import { SuggestedVideosShimmer } from '@components/Shimmers/WatchShimmer'
import useCuratedProfiles from '@lib/store/idb/curated'
import useProfileStore from '@lib/store/idb/profile'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type { PrimaryPublication, PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'

import SuggestedVideoCard from './SuggestedVideoCard'

const SuggestedVideos = () => {
  const {
    query: { id }
  } = useRouter()

  const { activeProfile } = useProfileStore()
  const curatedProfiles = useCuratedProfiles((state) => state.curatedProfiles)

  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: IS_MAINNET
          ? [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS]
          : undefined
      },
      publicationTypes: [PublicationType.Post],
      from: curatedProfiles
    },
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore, refetch } = usePublicationsQuery({
    variables: {
      request
    },
    skip: !curatedProfiles?.length
  })

  const videos = data?.publications?.items as PrimaryPublication[]
  const pageInfo = data?.publications?.pageInfo

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
      {!error && !loading && videos?.length ? (
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
