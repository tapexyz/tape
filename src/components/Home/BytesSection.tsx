import { useQuery } from '@apollo/client'
import BytesOutline from '@components/Common/Icons/BytesOutline'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { Analytics, TRACK } from '@utils/analytics'
import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  ExploreDocument,
  PublicationSortCriteria,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

const request = {
  sortCriteria: PublicationSortCriteria.CuratedProfiles,
  limit: 20,
  noRandomize: false,
  sources: [LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  customFilters: LENS_CUSTOM_FILTERS
}

const BytesSection = () => {
  const [bytes, setBytes] = useState<LenstubePublication[]>([])

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE_CURATED })
  }, [])

  const { data, loading, error } = useQuery(ExploreDocument, {
    variables: { request },
    onCompleted: (data) => {
      setBytes(data?.explorePublications?.items as LenstubePublication[])
    }
  })

  return (
    <>
      {data?.explorePublications?.items.length === 0 && (
        <NoDataFound isCenter withImage text="No bytes found" />
      )}
      {!error && !loading && (
        <div>
          <div className="flex space-x-2 mb-4 items-center">
            <BytesOutline className="w-4 h-4" />
            <h1 className="text-xl font-semibold">Bytes</h1>
          </div>
          <div className="flex no-scrollbar items-start overflow-x-auto touch-pan-x space-x-4 mb-16">
            {bytes.map((byte) => (
              <Link href={`/bytes/${byte.id}`} key={byte.id}>
                <div className="aspect-[9/16] h-[300px]">
                  <img
                    className="rounded-xl"
                    src={imageCdn(getThumbnailUrl(byte), 'thumbnail_v')}
                    alt="thumbnail"
                    draggable={false}
                  />
                </div>
                <h1 className="text-sm pt-2 line-clamp-2 break-words">
                  {byte.metadata?.name}
                </h1>
                <span className="text-[11px] opacity-70">
                  {byte.stats?.totalUpvotes} likes
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default BytesSection
