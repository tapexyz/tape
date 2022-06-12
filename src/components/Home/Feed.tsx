import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { FEED_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

const Timeline = dynamic(() => import('../../components/Home/Timeline'), {
  loading: () => <TimelineShimmer />
})

const HomeFeed = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { selectedChannel } = useAppStore()

  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        limit: 8,
        sources: [LENSTUBE_APP_ID]
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedChannel?.id,
    onCompleted(data) {
      setPageInfo(data?.timeline?.pageInfo)
      setVideos(data?.timeline?.items)
    }
  })

  const { observe } = useInView({
    threshold: 0.7,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            cursor: pageInfo?.next,
            limit: 8,
            sources: [LENSTUBE_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.timeline?.pageInfo)
        setVideos([...videos, ...data?.timeline?.items])
      })
    }
  })

  if (data?.timeline?.items?.length === 0) {
    return <NoDataFound text="No videos yet." />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default HomeFeed
