import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import LatestBytesShimmer from '@components/Shimmers/LatestBytesShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  FALLBACK_THUMBNAIL_URL,
  INFINITE_SCROLL_ROOT_MARGIN,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import type { Post, PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profileId: string
}

const ProfileBytes: FC<Props> = ({ profileId }) => {
  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
      },
      publicationTypes: [PublicationType.Post],
      from: [profileId]
    },
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profileId
  })

  const bytes = data?.publications?.items as Post[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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

  if (loading) {
    return <LatestBytesShimmer count={4} />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={`No bytes found`} />
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
                key={byte.id}
                href={`/bytes/${byte.id}`}
                className="hover:border-brand-500 rounded-large tape-border relative aspect-[9/16] w-full flex-none place-self-center overflow-hidden md:h-[400px]"
              >
                <img
                  className="h-full w-full object-cover"
                  src={imageCdn(thumbnailUrl, 'THUMBNAIL_V')}
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_THUMBNAIL_URL
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black px-4 py-2">
                  <h1 className="line-clamp-2 break-words font-bold text-white">
                    {getPublicationData(byte.metadata)?.title}
                  </h1>
                </div>
                <div
                  role="button"
                  className="absolute right-2 top-2 z-[1] rounded-full bg-white p-1.5"
                  onClick={(e) => e.preventDefault()}
                >
                  <PublicationOptions publication={byte} />
                </div>
              </Link>
            )
          })}
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Spinner />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileBytes
