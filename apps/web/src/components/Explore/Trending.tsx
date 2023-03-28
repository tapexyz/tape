import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import FireOutline from '@components/Common/Icons/FireOutline'
import IsVerified from '@components/Common/IsVerified'
import ThumbnailImage from '@components/Common/VideoCard/ThumbnailImage'
import TrendingShimmer from '@components/Shimmers/TrendingShimmer'
import clsx from 'clsx'
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
  ALLOWED_APP_IDS,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from 'utils'
import { formatNumber } from 'utils/functions/formatNumber'
import getLensHandle from 'utils/functions/getLensHandle'
import getProfilePicture from 'utils/functions/getProfilePicture'

const ExploreFeed = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const request = {
    sortCriteria: PublicationSortCriteria.TopCollected,
    limit: 20,
    sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID, ...ALLOWED_APP_IDS],
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    noRandomize: true,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error } = useExploreQuery({
    variables: {
      request
    }
  })

  const videos = data?.explorePublications?.items as Publication[]

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  if (loading) {
    return <TrendingShimmer />
  }

  if (!videos?.length || error) {
    return null
  }

  return (
    <div data-testid="bytes-section">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FireOutline className="h-3.5 w-3.5 text-red-500" />
          <h1 className="text-xl font-semibold">Trending 20</h1>
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
        className="no-scrollbar relative flex touch-pan-x items-start space-x-2 overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        {videos.map((video) => {
          const isByte = video.appId === LENSTUBE_BYTES_APP_ID
          return (
            <div
              key={video.id}
              className={clsx(
                'group relative h-[280px] rounded-xl bg-gray-300 dark:bg-gray-700',
                isByte ? 'aspect-[9/16]' : 'aspect-[16/9]'
              )}
            >
              <ThumbnailImage video={video} />
              <Link
                href={isByte ? `/bytes/${video.id}` : `/watch/${video.id}`}
                className="invisible absolute top-2 right-0 overflow-hidden rounded-l-xl bg-gray-900 py-2 px-3 text-white transition-all duration-200 ease-in-out group-hover:visible"
              >
                <span className="inline-flex items-center space-x-2 text-sm">
                  <CollectOutline className="h-3 w-3" />
                  <span>{formatNumber(video.stats.totalAmountOfCollects)}</span>
                </span>
              </Link>
              <div className="absolute bottom-0 right-0 left-0 overflow-hidden rounded-b-xl bg-gradient-to-t from-gray-900 to-transparent p-2 text-white">
                <div className="flex items-center space-x-2.5">
                  {!isByte && (
                    <Link
                      href={`/channel/${getLensHandle(video.profile?.handle)}`}
                      className="mt-0.5 flex-none"
                    >
                      <img
                        className="h-7 w-7 rounded-full"
                        src={getProfilePicture(video.profile, 'avatar')}
                        alt={getLensHandle(video.profile.handle)}
                        draggable={false}
                      />
                    </Link>
                  )}
                  <div className="grid-col grid flex-1">
                    <Link
                      className="line-clamp-1 break-words text-[15px] font-medium"
                      href={
                        isByte ? `/bytes/${video.id}` : `/watch/${video.id}`
                      }
                      title={video.metadata?.name ?? ''}
                    >
                      {video.metadata?.name}
                    </Link>
                    <Link
                      href={`/channel/${video.profile?.handle}`}
                      className="flex w-fit items-center space-x-0.5 text-[13px] opacity-90 hover:opacity-100"
                    >
                      <span>{video.profile?.handle}</span>
                      <IsVerified id={video.profile?.id} size="xs" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExploreFeed
