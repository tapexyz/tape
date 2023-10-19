import MetaTags from '@components/Common/MetaTags'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import type { FeedItem, FeedRequest, PrimaryPublication } from '@tape.xyz/lens'
import {
  FeedEventItemType,
  PublicationMetadataMainFocusType,
  useFeedQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'

const Feed = () => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

  const request: FeedRequest = {
    where: {
      feedEventItemTypes: [FeedEventItemType.Post],
      for: selectedSimpleProfile?.id,
      metadata: {
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
    skip: !selectedSimpleProfile?.id
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

  if (feedItems?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text={t`No videos in your feed, explore!`}
      />
    )
  }

  if (!loading && error) {
    return <Custom500 />
  }

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <MetaTags title={t`Your Feed`} />
      {loading && <TimelineShimmer />}
      {!error && !loading && (
        <>
          <div className="flex items-center space-x-3 text-xl">
            <h1 className="text-brand-400 font-bold">
              <Trans>Feed</Trans>
            </h1>
            <h1>
              <Trans>Your Friends' Stories</Trans>
            </h1>
          </div>
          <div className="laptop:grid-cols-5 ultrawide:pt-8 laptop:pt-6 ultrawide:grid-cols-6 grid-col-1 desktop:grid-cols-4 tablet:grid-cols-3 grid gap-x-4 gap-y-2 pt-4 md:gap-y-8">
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
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default Feed
