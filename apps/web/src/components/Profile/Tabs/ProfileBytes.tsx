import type { Post, PublicationsRequest } from '@tape.xyz/lens'
import type { FC } from 'react'

import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import LatestBytesShimmer from '@components/Shimmers/LatestBytesShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  FALLBACK_THUMBNAIL_URL,
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
}

const ProfileBytes: FC<Props> = ({ profileId }) => {
  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      from: [profileId],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
      },
      publicationTypes: [PublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    skip: !profileId,
    variables: { request }
  })

  const bytes = data?.publications?.items as Post[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  if (loading) {
    return <LatestBytesShimmer count={4} />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter text={`No bytes found`} withImage />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div className="laptop:grid-cols-5 grid grid-cols-2 justify-center gap-2 md:grid-cols-3">
          {bytes.map((byte) => {
            const thumbnailUrl = imageCdn(
              getThumbnailUrl(byte.metadata),
              'THUMBNAIL_V'
            )
            return (
              <Link
                className="hover:border-brand-500 rounded-large tape-border relative aspect-[9/16] w-full flex-none place-self-center overflow-hidden md:h-[400px]"
                href={`/bytes/${byte.id}`}
                key={byte.id}
              >
                <img
                  alt="thumbnail"
                  className="h-full w-full object-cover"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_THUMBNAIL_URL
                  }}
                  src={imageCdn(thumbnailUrl, 'THUMBNAIL_V')}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black px-4 py-2">
                  <h1 className="line-clamp-2 break-words font-bold text-white">
                    {getPublicationData(byte.metadata)?.title}
                  </h1>
                </div>
                <div
                  className="absolute right-2 top-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PublicationOptions publication={byte} variant="solid" />
                </div>
              </Link>
            )
          })}
          {pageInfo?.next && (
            <span className="flex justify-center p-10" ref={observe}>
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileBytes
