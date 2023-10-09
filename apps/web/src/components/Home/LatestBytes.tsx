import Badge from '@components/Common/Badge'
import LatestBytesShimmer from '@components/Shimmers/LatestBytesShimmer'
import { Trans } from '@lingui/macro'
import { FALLBACK_COVER_URL, LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import {
  getProfilePicture,
  getThumbnailUrl,
  imageCdn,
  trimLensHandle
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

  const bytes = data?.explorePublications
    ?.items as unknown as PrimaryPublication[]

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
          <Link
            href={`/bytes/${byte.id}`}
            key={byte.id}
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
            <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/30 to-transparent px-4 py-2 text-white">
              <h1 className="line-clamp-1 break-words">
                {byte.metadata.marketplace?.name}
              </h1>
              <p className="text-xs opacity-80">
                {byte.stats?.reactions} <Trans>likes</Trans>
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center space-x-1.5 bg-gradient-to-t from-black/30 to-transparent px-4 py-2 text-white">
              <img
                className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-800"
                src={getProfilePicture(byte.by, 'AVATAR')}
                alt={byte.by?.handle}
                draggable={false}
              />
              <span className="font-medium">
                {trimLensHandle(byte.by?.handle)} <Badge id={byte.by.id} />
              </span>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default LatestBytes
