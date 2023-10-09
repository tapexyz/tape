import BytesShimmer from '@components/Shimmers/BytesShimmer'
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
    return <BytesShimmer />
  }

  if (!bytes?.length || error) {
    return null
  }

  return (
    <>
      {bytes.map((byte) => {
        const thumbnailUrl = getThumbnailUrl(byte)
        return (
          <div key={byte.id} className="w-[260px] space-y-1">
            <Link href={`/bytes/${byte.id}`}>
              <div className="aspect-[9/16] h-[400px] w-[260px]">
                <img
                  className="h-full rounded-xl object-cover"
                  src={
                    thumbnailUrl ? imageCdn(thumbnailUrl, 'THUMBNAIL_V') : ''
                  }
                  alt="thumbnail"
                  draggable={false}
                  onError={({ currentTarget }) => {
                    currentTarget.src = FALLBACK_COVER_URL
                  }}
                />
              </div>
              <h1 className="line-clamp-2 break-words pt-2 text-[13px]">
                {byte.metadata.marketplace?.name}
              </h1>
            </Link>
            <div className="flex items-end space-x-1.5">
              <Link
                href={`/channel/${trimLensHandle(byte.by?.handle)}`}
                className="flex-none"
                title={byte.by.handle}
              >
                <img
                  className="h-3.5 w-3.5 rounded-full bg-gray-200 dark:bg-gray-800"
                  src={getProfilePicture(byte.by, 'AVATAR')}
                  alt={byte.by?.handle}
                  draggable={false}
                />
              </Link>
              <span className="text-xs leading-3 opacity-70">
                {byte.stats?.reactions} <Trans>likes</Trans>
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default LatestBytes
