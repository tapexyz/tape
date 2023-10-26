import HorizantalScroller from '@components/Common/HorizantalScroller'
import StreamCard from '@components/Common/VideoCard/StreamCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
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
import React, { useRef } from 'react'

const request: ExplorePublicationRequest = {
  where: {
    publicationTypes: [ExplorePublicationType.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMetadataMainFocusType.Livestream]
    }
  },
  orderBy: ExplorePublicationsOrderByType.LensCurated,
  limit: LimitType.Ten
}

const LiveSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data, error, loading } = useExplorePublicationsQuery({
    variables: { request }
  })

  const streams = data?.explorePublications?.items as PrimaryPublication[]

  if (!streams?.length || error) {
    return null
  }

  return (
    <div className="laptop:pt-6 flex flex-col pt-4">
      <HorizantalScroller
        sectionRef={sectionRef}
        heading={`Live`}
        subheading={`What's Popping?`}
      />
      <div
        ref={sectionRef}
        className="no-scrollbar ultrawide:pt-8 laptop:pt-6 relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth pt-4"
      >
        {loading && <TimelineShimmer count={10} />}
        {!error && !loading && (
          <>
            {streams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default LiveSection
