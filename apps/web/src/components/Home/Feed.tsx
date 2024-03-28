import CategoryFilters from '@components/Common/CategoryFilters'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID,
  TAPE_CURATOR_ID
} from '@tape.xyz/constants'
import type { FeedItem, FeedRequest, PrimaryPublication } from '@tape.xyz/lens'
import {
  FeedEventItemType,
  PublicationMetadataMainFocusType,
  useFeedQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

// const since = getUnixTimestampForDaysAgo(30)

const Feed = ({ showFilter = true }) => {
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request: FeedRequest = {
    where: {
      feedEventItemTypes: [FeedEventItemType.Post],
      for: TAPE_CURATOR_ID,
      metadata: {
        publishedOn: [TAPE_APP_ID, LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
        mainContentFocus: [PublicationMetadataMainFocusType.Video]
      }
    }
  }

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: { request }
  })

  const pageInfo = data?.feed?.pageInfo
  const feedItems = data?.feed?.items as FeedItem[]

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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

  return (
    <div className="laptop:pt-6 space-y-4 pt-4">
      {showFilter && <CategoryFilters />}
      <div>
        {loading && <TimelineShimmer />}
        {!error && !loading && feedItems.length > 0 && (
          <>
            <div className="ultrawide:grid-cols-6 grid-col-1 desktop:grid-cols-4 tablet:grid-cols-3 grid gap-x-4 gap-y-2 md:gap-y-6">
              {feedItems?.map((feedItem: FeedItem) => {
                const video = feedItem.root
                return (
                  <VideoCard
                    key={video?.id}
                    video={video as PrimaryPublication}
                  />
                )
              })}
            </div>
            {pageInfo?.next && (
              <span ref={observe} className="flex justify-center p-10">
                <Spinner />
              </span>
            )}
          </>
        )}
        {feedItems?.length === 0 && (
          <NoDataFound isCenter withImage text={`No videos found`} />
        )}
      </div>
    </div>
  )
}

export default Feed
