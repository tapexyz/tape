import { useQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { COMMENT_FEED_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { AiOutlineComment } from 'react-icons/ai'
import { PaginatedResultInfo } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import NewComment from './NewComment'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: LenstubePublication
}

const VideoComments: FC<Props> = ({ video }) => {
  const {
    query: { id }
  } = useRouter()
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const isMembership =
    video.profile?.followModule?.__typename === 'FeeFollowModuleSettings'

  const [comments, setComments] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    COMMENT_FEED_QUERY,
    {
      variables: {
        request: {
          commentsOf: id,
          limit: 10
        },
        reactionRequest: selectedChannel
          ? { profileId: selectedChannel?.id }
          : null,
        customFilters: LENS_CUSTOM_FILTERS
      },
      skip: !id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setComments(data?.publications?.items)
      }
    }
  )

  const refetchComments = () => {
    refetch({
      request: {
        commentsOf: id,
        limit: 10
      },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      customFilters: LENS_CUSTOM_FILTERS
    })
  }

  const { observe } = useInView({
    rootMargin: '1000px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              commentsOf: id,
              cursor: pageInfo?.next,
              limit: 10
            },
            reactionRequest: selectedChannel
              ? { profileId: selectedChannel?.id }
              : null,
            customFilters: LENS_CUSTOM_FILTERS
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setComments([...comments, ...data?.publications?.items])
      } catch (error) {
        logger.error('[Error Fetch Video Comments]', error)
      }
    }
  })

  if (loading) return <CommentsShimmer />

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center my-4 space-x-2 text-lg">
          <AiOutlineComment />
          <span className="font-semibold">Comments</span>
          {data?.publications?.pageInfo.totalCount ? (
            <span className="text-sm">
              ( {data?.publications?.pageInfo.totalCount} )
            </span>
          ) : null}
        </h1>
        {!selectedChannelId && (
          <span className="text-xs">(Sign in required to comment)</span>
        )}
      </div>
      {data?.publications?.items.length === 0 && (
        <NoDataFound text="Be the first to comment." />
      )}
      {video?.canComment.result ? (
        <NewComment video={video} refetchComments={() => refetchComments()} />
      ) : (
        <Alert variant="warning">
          <span className="text-sm">
            Only {isMembership ? 'members' : 'subscribers'} can comment on this
            publication
          </span>
        </Alert>
      )}
      {!error && !loading && (
        <>
          <div className="pt-5 space-y-4">
            {comments?.map((comment: LenstubePublication) => (
              <Comment
                key={`${comment?.id}_${comment.createdAt}`}
                comment={comment}
              />
            ))}
          </div>
          {pageInfo?.next && comments.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default VideoComments
