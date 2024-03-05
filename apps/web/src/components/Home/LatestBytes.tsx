import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import LatestBytesShimmer from '@components/Shimmers/LatestBytesShimmer'
import { getUnixTimestampForDaysAgo } from '@lib/formatTime'
import { getRandomFeedOrder } from '@lib/getRandomFeedOrder'
import {
  FALLBACK_THUMBNAIL_URL,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import type {
  ExplorePublicationRequest,
  PrimaryPublication
} from '@tape.xyz/lens'
import {
  ExplorePublicationType,
  LimitType,
  PublicationMetadataMainFocusType,
  useExplorePublicationsQuery
} from '@tape.xyz/lens'
import Link from 'next/link'
import React from 'react'

const since = getUnixTimestampForDaysAgo(30)
const orderBy = getRandomFeedOrder()

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
      publishedOn: [TAPE_APP_ID, LENSTUBE_BYTES_APP_ID]
    },
    since
  },
  orderBy,
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
        const thumbnailUrl = getThumbnailUrl(byte.metadata)
        return (
          <div className="flex flex-col" key={byte.id}>
            <Link
              href={`/bytes/${byte.id}`}
              className="ultrawide:w-[260px] rounded-large ultrawide:h-[400px] relative aspect-[9/16] h-[350px] w-[220px] flex-none overflow-hidden"
            >
              <img
                className="h-full object-cover"
                src={thumbnailUrl ? imageCdn(thumbnailUrl, 'THUMBNAIL_V') : ''}
                alt="thumbnail"
                height={1000}
                width={600}
                draggable={false}
                onError={({ currentTarget }) => {
                  currentTarget.src = FALLBACK_THUMBNAIL_URL
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black px-4 py-2">
                <h1 className="line-clamp-2 break-all font-bold text-white">
                  {getPublicationData(byte.metadata)?.title}
                </h1>
              </div>
            </Link>
            <span>
              <HoverableProfile profile={byte.by} key={byte.by?.id}>
                <Link
                  href={getProfile(byte.by)?.link}
                  className="inline-flex items-center space-x-1 px-3 py-1"
                >
                  <img
                    className="size-4 rounded-full bg-gray-200 dark:bg-gray-800"
                    src={getProfilePicture(byte.by, 'AVATAR')}
                    height={50}
                    width={50}
                    alt={`${getProfile(byte.by)?.slug}'s PFP`}
                    draggable={false}
                  />
                  <span className="flex items-center space-x-1 font-medium">
                    <span>{getProfile(byte.by)?.slug}</span>
                    <Badge id={byte.by.id} size="xs" />
                  </span>
                </Link>
              </HoverableProfile>
            </span>
          </div>
        )
      })}
    </>
  )
}

export default LatestBytes
