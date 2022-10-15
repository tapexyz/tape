import { useQuery } from '@apollo/client'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { FEED_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'
import {
  FeedEventItemType,
  FeedItem,
  PaginatedResultInfo,
  PublicationMainFocus
} from 'src/types'
import { LenstubePublication } from 'src/types/local'

const request = {
  limit: 50,
  feedEventItemTypes: [FeedEventItemType.Post, FeedEventItemType.Comment],
  metadata: { mainContentFocus: [PublicationMainFocus.Video] }
}

const HomeFeed = () => {
  const [videos, setVideos] = useState<FeedItem[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        ...request
      }
    },
    skip: !selectedChannel?.id,
    onCompleted: (data) => {
      setPageInfo(data?.feed?.pageInfo)
      setVideos(data?.feed?.items)
    }
  })

  const { observe } = useInView({
    rootMargin: '1000px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              profileId: selectedChannel?.id,
              cursor: pageInfo?.next,
              ...request
            }
          }
        })
        setPageInfo(data?.feed?.pageInfo)
        setVideos([...videos, ...data?.feed?.items])
      } catch (error) {
        logger.error('[Error Fetch Feed]', error)
      }
    }
  })

  if (data?.feed?.items?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="You got no videos in your feed, explore!"
      />
    )
  }

  if (error) {
    return <Custom500 />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && (
        <>
          <div className="grid gap-x-5 lg:grid-cols-4 md:gap-y-8 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
            {videos?.map((feedItem: FeedItem) => {
              const video = feedItem.root
              return (
                <VideoCard
                  key={`${video?.id}_${video.createdAt}`}
                  video={video as LenstubePublication}
                />
              )
            })}
          </div>
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default HomeFeed
