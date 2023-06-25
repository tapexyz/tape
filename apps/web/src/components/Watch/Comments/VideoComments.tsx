import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Publication } from '@lenstube/lens'
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  useCommentsQuery
} from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import {
  CustomCommentsFilterEnum,
  LENS_CUSTOM_FILTERS,
  SCROLL_ROOT_MARGIN
} from 'utils'

import Comment from './Comment'
import CommentsFilter from './CommentsFilter'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

type Props = {
  video: Publication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
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

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <>
            <h1 className="m-2 flex items-center space-x-2 text-lg">
              <CommentOutline className="h-5 w-5" />
              <span className="font-medium">
                <Trans>Comments</Trans>{' '}
                {video.stats.commentsTotal
                  ? `( ${video.stats.commentsTotal} )`
                  : null}
              </span>
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
                  ? t`Only subscribers can comment on this publication`
                  : `Only subscribers within ${video.profile.handle}'s preferred network can comment`}
              </span>
            </Alert>
          ) : null}
          {!comments.length && !queuedComments.length ? (
            <span className="py-5">
              <NoDataFound
                text={t`Be the first to comment`}
                withImage
                isCenter
              />
            </span>
          ) : null}
          {!error && (queuedComments.length || comments.length) ? (
            <>
              <div className="space-y-4 py-4">
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
      ) : null}
    </>
  )
}

export default VideoComments
