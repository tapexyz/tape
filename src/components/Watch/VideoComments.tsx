import { useQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { COMMENT_FEED_QUERY } from '@utils/gql/queries'
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
  const { isAuthenticated, selectedChannel } = usePersistStore()
  const onlySubscribersCanComment =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'
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
          limit: 10,
          sources: [LENSTUBE_APP_ID]
        },
        reactionRequest: selectedChannel
          ? { profileId: selectedChannel?.id }
          : null
      },
      skip: !id,
      fetchPolicy: 'no-cache',
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
        limit: 10,
        sources: [LENSTUBE_APP_ID]
      },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null
    })
  }

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              commentsOf: id,
              cursor: pageInfo?.next,
              limit: 10,
              sources: [LENSTUBE_APP_ID]
            },
            reactionRequest: selectedChannel
              ? { profileId: selectedChannel?.id }
              : null
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
        {!isAuthenticated && (
          <span className="text-xs">(Sign in required to comment)</span>
        )}
      </div>
      {data?.publications?.items.length === 0 && (
        <NoDataFound text="Be the first to comment." />
      )}
      {onlySubscribersCanComment ? (
        video.profile.isFollowedByMe ? (
          <NewComment video={video} refetchComments={() => refetchComments()} />
        ) : (
          <Alert variant="warning">
            <span>
              Only {isMembership ? 'members' : 'subscribers'} can comment
            </span>
          </Alert>
        )
      ) : (
        <NewComment video={video} refetchComments={() => refetchComments()} />
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
