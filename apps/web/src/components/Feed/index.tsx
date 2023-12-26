import type { FeedItem, FeedRequest, PrimaryPublication } from '@tape.xyz/lens'

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
import {
  FeedEventItemType,
  PublicationMetadataMainFocusType,
  useFeedQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
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
        mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: [TAPE_APP_ID, LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        tags:
          activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined
      }
    }
  }

  const { data, error, fetchMore, loading } = useFeedQuery({
    skip: !activeProfile?.id,
    variables: {
      request
    }
  })

  const feedItems = data?.feed?.items as FeedItem[]
  const pageInfo = data?.feed?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  if (!loading && error) {
    return <Custom500 />
  }

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <MetaTags title="Your Feed" />
      <CategoryFilters heading="Feed" subheading="Your Friends' Stories" />
      {loading && <TimelineShimmer className="laptop:pt-6 pt-4" />}
      {!loading && !feedItems?.length ? (
        <NoDataFound
          className="my-20"
          isCenter
          text="No videos found!"
          withImage
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
            <span className="flex justify-center p-10" ref={observe}>
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default Feed
