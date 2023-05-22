import BytesOutline from '@components/Common/Icons/BytesOutline'
import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import BytesShimmer from '@components/Shimmers/BytesShimmer'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import type { Publication } from 'lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'lens'
import Link from 'next/link'
import React, { useRef } from 'react'
import {
  FALLBACK_COVER_URL,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID
} from 'utils'
import { generateVideoThumbnail } from 'utils/functions/generateVideoThumbnails'
import getLensHandle from 'utils/functions/getLensHandle'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'

const BytesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 30,
    noRandomize: false,
    sources: [LENSTUBE_BYTES_APP_ID],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, error, loading } = useExploreQuery({
    variables: { request }
  })

  const bytes = data?.explorePublications?.items as Publication[]

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  if (loading) {
    return <BytesShimmer />
  }

  if (!bytes?.length || error) {
    return null
  }

  return (
    <div className="hidden lg:block" data-testid="bytes-section">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BytesOutline className="h-4 w-4" />
          <h1 className="text-xl font-semibold">
            <Trans>Bytes</Trans>
          </h1>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => scroll(-scrollOffset)}
            className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none"
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(scrollOffset)}
            className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none"
          >
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={sectionRef}
        className="no-scrollbar relative mb-3 flex touch-pan-x items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        {bytes.map((byte) => {
          const thumbnailUrl = getThumbnailUrl(byte)
          return (
            <div key={byte.id} className="w-44 space-y-1">
              <Link href={`/bytes/${byte.id}`}>
                <div className="aspect-[9/16] h-[280px]">
                  <img
                    className="h-full rounded-xl object-cover"
                    src={
                      thumbnailUrl ? imageCdn(thumbnailUrl, 'THUMBNAIL_V') : ''
                    }
                    alt="thumbnail"
                    draggable={false}
                    onError={async ({ currentTarget }) => {
                      currentTarget.src = FALLBACK_COVER_URL
                      const thumbnail = await generateVideoThumbnail(
                        getPublicationMediaUrl(byte)
                      )
                      currentTarget.onerror = null
                      if (thumbnail?.includes('base64')) {
                        currentTarget.src = thumbnail
                      }
                    }}
                  />
                </div>
                <h1 className="line-clamp-2 break-words pt-2 text-[13px]">
                  {byte.metadata?.name}
                </h1>
              </Link>
              <div className="flex items-end space-x-1.5">
                <Link
                  href={`/channel/${getLensHandle(byte.profile?.handle)}`}
                  className="flex-none"
                  title={getLensHandle(byte.profile.handle)}
                >
                  <img
                    className="h-3.5 w-3.5 rounded-full bg-gray-200 dark:bg-gray-800"
                    src={getProfilePicture(byte.profile, 'avatar')}
                    alt={getLensHandle(byte.profile?.handle)}
                    draggable={false}
                  />
                </Link>
                <span className="text-xs leading-3 opacity-70">
                  {byte.stats?.totalUpvotes} <Trans>likes</Trans>
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default BytesSection
