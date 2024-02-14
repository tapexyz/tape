import CategoryFilters from '@components/Common/CategoryFilters'
import MetaTags from '@components/Common/MetaTags'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { FeedItem, FeedRequest, PrimaryPublication } from '@tape.xyz/lens'
import {
  FeedEventItemType,
  PublicationMetadataMainFocusType,
  useFeedQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import React, { useEffect } from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'

const Feed = () => {
  const { activeProfile } = useProfileStore()
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.FEED })
  }, [])

  const request: FeedRequest = {
    where: {
      feedEventItemTypes: [FeedEventItemType.Post],
      for: activeProfile?.id,
      metadata: {
        publishedOn: [TAPE_APP_ID, LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
        mainContentFocus: [PublicationMetadataMainFocusType.Video]
      }
    }
  }

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: {
      request
    },
    skip: !activeProfile?.id
  })

  const feedItems = data?.feed?.items as FeedItem[]
  const pageInfo = data?.feed?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    }
  })

  if (!loading && error) {
    return <Custom500 />
  }

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <MetaTags title="Your Feed" />
      <CategoryFilters heading="Your Feed" />
      {loading && <TimelineShimmer className="laptop:pt-6 pt-4" />}
      {!loading && !feedItems?.length ? (
        <NoDataFound
          className="my-20"
          isCenter
          withImage
          text="No videos found!"
        />
      ) : null}
      {!error && !loading && (
        <>
          <div className="laptop:pt-6 ultrawide:grid-cols-6 grid-col-1 desktop:grid-cols-4 tablet:grid-cols-3 grid gap-x-4 gap-y-2 pt-4 md:gap-y-6">
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
    </div>
  )
}

export default Feed
