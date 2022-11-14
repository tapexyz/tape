import BytesOutline from '@components/Common/Icons/BytesOutline'
import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

const BytesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE_CURATED })
  }, [])

  useEffect(() => {
    const ref = sectionRef.current
    if (ref) {
      ref.addEventListener('wheel', (evt) => {
        evt.preventDefault()
        ref.scrollLeft += evt.deltaY
      })
    }
  }, [sectionRef])

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

  const { data, error } = useExploreQuery({
    variables: { request }
  })

  const bytes = data?.explorePublications?.items as LenstubePublication[]

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (scrollOffset: number) => {
    if (sectionRef.current) sectionRef.current.scrollLeft += scrollOffset
  }

  if (!bytes?.length || error) {
    return null
  }

  return (
    <>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex space-x-2 items-center">
          <BytesOutline className="w-4 h-4" />
          <h1 className="text-xl font-semibold">Bytes</h1>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => scroll(-scrollOffset)}
            className="bg-gray-500 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(scrollOffset)}
            className="bg-gray-500 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
          >
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={sectionRef}
        className="flex scroll-smooth relative no-scrollbar items-start overflow-x-auto touch-pan-x space-x-4 mb-3"
      >
        {bytes.map((byte) => (
          <Link href={`/bytes?id=${byte.id}`} className="w-44" key={byte.id}>
            <div className="aspect-[9/16] h-[300px]">
              <img
                className="rounded-xl"
                src={imageCdn(getThumbnailUrl(byte), 'thumbnail_v')}
                alt="thumbnail"
                draggable={false}
              />
            </div>
            <h1 className="text-[13px] pt-2 line-clamp-2 break-words">
              {byte.metadata?.name}
            </h1>
            <span className="text-xs opacity-70">
              {byte.stats?.totalUpvotes} likes
            </span>
          </Link>
        ))}
      </div>
      <hr className="my-8 border-theme dark:border-gray-700 border-opacity-10" />
    </>
  )
}

export default BytesSection
