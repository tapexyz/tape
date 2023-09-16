import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { SCROLL_ROOT_MARGIN } from '@lenstube/constants'
import type { FeedItem, Publication } from '@lenstube/lens'
import {
  FeedEventItemType,
  PublicationMainFocus,
  useFeedQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import React from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'

const Subscriptions = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request = {
    limit: 50,
    feedEventItemTypes: [FeedEventItemType.Post],
    profileId: selectedSimpleProfile?.id,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: {
      request
    },
    skip: !selectedSimpleProfile?.id
  })

  const videos = data?.feed?.items as FeedItem[]
  const pageInfo = data?.feed?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
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

  if (videos?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text={t`You got no videos in your feed, explore!`}
      />
    )
  }

  if (!loading && error) {
    return <Custom500 />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && (
        <>
          <div className="laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8 2xl:grid-cols-5">
            {videos?.map((feedItem: FeedItem) => {
              const video = feedItem.root
              return (
                <VideoCard
                  key={`${video?.id}_${video.createdAt}`}
                  video={video as Publication}
                />
              )
            })}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default Subscriptions
