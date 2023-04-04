import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { usePaginationLoading } from '@hooks/usePaginationLoading'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  PublicationMainFocus,
  useCommentsQuery
} from 'lens'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { CustomCommentsFilterEnum, LENS_CUSTOM_FILTERS } from 'utils'

import CommentsFilter from './CommentsFilter'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: Publication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const selectedCommentFilter = useChannelStore(
    (state) => state.selectedCommentFilter
  )

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const getCommentFilters = () => {
    if (selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS) {
      return {
        commentsOfOrdering: CommentOrderingTypes.Ranking,
        commentsRankingFilter: CommentRankingFilter.Relevant
      }
    } else if (
      selectedCommentFilter === CustomCommentsFilterEnum.NEWEST_COMMENTS
    ) {
      return {
        commentsOfOrdering: CommentOrderingTypes.Desc
      }
    } else {
      return {}
    }
  }

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
    ...getCommentFilters()
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

  usePaginationLoading({
    ref: sectionRef,
    hasMore: !!pageInfo?.next,
    fetch: async () =>
      await fetchMore({
        variables: {
          ...variables,
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
  })

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <>
            <h1 className="m-2 flex items-center space-x-2 text-lg">
              <CommentOutline className="h-5 w-5" />
              <span className="font-medium">Comments</span>
            </h1>
            <CommentsFilter />
          </>
        )}
      </div>
      {loading && <CommentsShimmer />}
      {!loading && video ? (
        <>
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
            <span className="py-5">
              <NoDataFound text="Be the first to comment." withImage isCenter />
            </span>
          ) : null}
          {!error && (queuedComments.length || comments.length) ? (
            <>
              <div className="space-y-4" ref={sectionRef}>
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
                <span className="flex justify-center p-10">
                  <Loader />
                </span>
              )}
            </>
          ) : null}
        </>
      ) : null}
    </>
  )
}

export default VideoComments
