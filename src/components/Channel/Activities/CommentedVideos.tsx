import { useQuery } from '@apollo/client'
import CommentedVideoCard from '@components/Library/CommentedVideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { PROFILE_FEED_QUERY } from '@utils/gql/queries'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo, Profile } from 'src/types'
import { LenstubePublication } from 'src/types/local'

type Props = {
  channel: Profile
}

const CommentedVideos: FC<Props> = ({ channel }) => {
  const [channelVideos, setChannelVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: 'COMMENT',
        profileId: channel?.id,
        limit: 8,
        sources: [LENSTUBE_APP_ID]
      }
    },
    skip: !channel?.id,
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setChannelVideos(data?.publications?.items)
    }
  })
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            publicationTypes: 'COMMENT',
            profileId: channel?.id,
            cursor: pageInfo?.next,
            limit: 8,
            sources: [LENSTUBE_APP_ID]
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.publications?.pageInfo)
        setChannelVideos([...channelVideos, ...data?.publications?.items])
      })
    }
  })

  if (loading) return <TimelineShimmer />

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound text="No comments on videos." />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <div>
          <div className="grid gap-x-4 lg:grid-cols-4 gap-y-1.5 md:gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
            {channelVideos?.map((video: LenstubePublication, idx: number) => (
              <CommentedVideoCard
                key={idx}
                comment={video as LenstubePublication}
              />
            ))}
          </div>
          {pageInfo?.next && channelVideos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentedVideos
