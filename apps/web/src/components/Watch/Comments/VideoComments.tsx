import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import {
  CommentRankingFilter,
  PublicationMainFocus,
  useCommentsQuery
} from 'lens'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import type { CommentsFilterType } from 'utils'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils'

import CommentsFilter from './CommentsFilter'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: Publication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
  const [rankingFilter, setRankingFilter] = useState<CommentsFilterType>({
    commentsRankingFilter: CommentRankingFilter.Relevant
  })

  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const request = {
    limit: 30,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: video.id,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Video,
        PublicationMainFocus.Article,
        PublicationMainFocus.Embed,
        PublicationMainFocus.Link,
        PublicationMainFocus.TextOnly
      ]
    },
    ...rankingFilter
  }
  const variables = {
    request,
    reactionRequest: selectedChannel
      ? { profileId: selectedChannel?.id }
      : null,
    channelId: selectedChannel?.id ?? null
  }

  const { data, loading, error, fetchMore } = useCommentsQuery({
    variables,
    skip: !video.id
  })

  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          ...variables,
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <CommentsShimmer />
  }

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <h1 className="m-2 flex items-center space-x-2 text-lg">
            <CommentOutline className="h-5 w-5" />
            <span className="font-medium">Comments</span>
          </h1>
        )}
        <CommentsFilter
          rankingFilter={rankingFilter}
          onSort={(filter) => setRankingFilter(filter)}
        />
      </div>
      {video?.canComment.result ? (
        <NewComment video={video} />
      ) : selectedChannelId ? (
        <Alert variant="warning">
          <span className="text-sm">
            {isFollowerOnlyReferenceModule
              ? 'Only subscribers can comment on this publication'
              : `Only subscribers within ${video.profile.handle}'s preferred network can comment`}
          </span>
        </Alert>
      ) : null}
      {!comments.length && !queuedComments.length ? (
        <span className="pb-5">
          <NoDataFound text="Be the first to comment." withImage isCenter />
        </span>
      ) : null}
      {!error && (queuedComments.length || comments.length) ? (
        <>
          <div className="space-y-4">
            {queuedComments?.map(
              (queuedComment) =>
                queuedComment?.pubId === video?.id && (
                  <QueuedComment
                    key={queuedComment?.pubId}
                    queuedComment={queuedComment}
                  />
                )
            )}
            {comments?.map(
              (comment: Publication) =>
                !comment.hidden && (
                  <Comment
                    key={`${comment?.id}_${comment.createdAt}`}
                    comment={comment}
                  />
                )
            )}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      ) : null}
    </>
  )
}

export default VideoComments
