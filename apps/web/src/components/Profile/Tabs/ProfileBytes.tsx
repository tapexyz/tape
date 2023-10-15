import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import {
  FALLBACK_COVER_URL,
  LENS_CUSTOM_FILTERS,
  SCROLL_ROOT_MARGIN
} from '@tape.xyz/constants'
import { getThumbnailUrl, imageCdn } from '@tape.xyz/generic'
import type { Post, PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
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
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo]
      },
      publicationTypes: [PublicationType.Post],
      customFilters: LENS_CUSTOM_FILTERS,
      from: [profileId]
    },
    limit: LimitType.TwentyFive
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !profileId
  })

  const bytes = data?.publications?.items as Post[]
  const pageInfo = data?.publications?.pageInfo

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

  if (loading) {
    return <TimelineShimmer />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No bytes found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div className="laptop:grid-cols-5 grid-col-2 grid gap-x-4 gap-y-2 md:grid-cols-4 md:gap-y-6">
          {bytes.map((byte) => {
            const thumbnailUrl = imageCdn(getThumbnailUrl(byte), 'THUMBNAIL_V')
            return (
              <Link
                key={byte.id}
                href={`/bytes/${byte.id}`}
                className="ultrawide:w-[260px] hover:border-brand-500 rounded-large ultrawide:h-[400px] tape-border relative aspect-[9/16] h-[350px] w-[220px] flex-none overflow-hidden"
              >
                <img
                  className="h-full object-cover"
                  src={
                    thumbnailUrl ? imageCdn(thumbnailUrl, 'THUMBNAIL_V') : ''
                  }
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_COVER_URL
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/30 px-4 py-2 text-white">
                  <h1 className="line-clamp-2 break-words font-semibold">
                    {byte.metadata.marketplace?.name}
                  </h1>
                </div>
              </Link>
            )
          })}
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileBytes
