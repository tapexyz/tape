import Badge from '@components/Common/Badge'
import LatestBytesShimmer from '@components/Shimmers/LatestBytesShimmer'
import { getShortHandTime } from '@lib/formatTime'
import { FALLBACK_COVER_URL, LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import Link from 'next/link'
import React from 'react'

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo]
    }
  },
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  limit: LimitType.Fifty
}

const LatestBytes = () => {
  const { data, error, loading } = useExplorePublicationsQuery({
    variables: { request }
  })

  const bytes = data?.explorePublications?.items as PrimaryPublication[]

  if (loading) {
    return <LatestBytesShimmer />
  }

  if (!bytes?.length || error) {
    return null
  }

  return (
    <>
      {bytes.map((byte) => {
        const thumbnailUrl = getThumbnailUrl(byte)
        return (
          <div className="group flex flex-col" key={byte.id}>
            <Link
              href={`/bytes/${byte.id}`}
              className="ultrawide:w-[260px] hover:border-brand-500 rounded-large ultrawide:h-[400px] tape-border relative aspect-[9/16] h-[350px] w-[220px] flex-none overflow-hidden"
            >
              <img
                className="h-full object-cover"
                src={thumbnailUrl ? imageCdn(thumbnailUrl, 'THUMBNAIL_V') : ''}
                alt="thumbnail"
                draggable={false}
                onError={({ currentTarget }) => {
                  currentTarget.src = FALLBACK_COVER_URL
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black/30 px-4 py-2 text-white">
                <h1 className="line-clamp-1 break-words">
                  {byte.metadata.marketplace?.name}
                </h1>
              </div>
            </Link>
            <div className="invisible flex items-center p-1 group-hover:visible">
              <Link
                href={`/u/${getProfile(byte.by)?.slug}`}
                className="flex items-center space-x-1"
              >
                <img
                  className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800"
                  src={getProfilePicture(byte.by, 'AVATAR')}
                  alt={getProfile(byte.by)?.slug}
                  draggable={false}
                />
                <span className="font-medium">
                  {getProfile(byte.by)?.slug} <Badge id={byte.by.id} />
                </span>
              </Link>
              <span className="middot" />
              <p className="text-xs opacity-80">
                {getShortHandTime(byte.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default LatestBytes
