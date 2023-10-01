import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@lenstube/constants'
import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@lenstube/lens'
import {
  LimitType,
  PublicationsOrderByType,
  TriStateValue,
  usePublicationsQuery
} from '@lenstube/lens'
import { Loader } from '@lenstube/ui'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

import CommentsFilter from './CommentsFilter'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'
import RenderComment from './RenderComment'

type Props = {
  video: MirrorablePublication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)
  // const selectedCommentFilter = useChannelStore(
  //   (state) => state.selectedCommentFilter
  // )

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const isDegreesOfSeparationReferenceModule =
    video?.referenceModule?.__typename ===
    'DegreesOfSeparationReferenceModuleSettings'

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      commentOn: {
        id: video.id
        // commentsRankingFilter:
        //   selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS
        //     ? CommentRankingFilterType.Relevant
        //     : CommentRankingFilterType.NoneRelevant
      }
    },
    orderBy: PublicationsOrderByType.Latest
    // selectedCommentFilter === CustomCommentsFilterEnum.NEWEST_COMMENTS
    //   ? PublicationsOrderByType.Latest
    //   : PublicationsOrderByType.CommentOfQueryRanking
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !video.id
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })
  const showReferenceModuleAlert =
    selectedSimpleProfile?.id &&
    (isFollowerOnlyReferenceModule || isDegreesOfSeparationReferenceModule)

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <>
            <h1 className="m-2 flex items-center space-x-2 text-lg">
              <CommentOutline className="h-5 w-5" />
              <span className="font-medium">
                <Trans>Comments</Trans>{' '}
                {video.stats.comments ? `( ${video.stats.comments} )` : null}
              </span>
            </h1>
            <CommentsFilter />
          </>
        )}
      </div>
      {loading && <CommentsShimmer />}
      {!loading && video ? (
        <>
          {video?.operations.canComment === TriStateValue.Yes ? (
            <NewComment video={video} />
          ) : showReferenceModuleAlert ? (
            <Alert variant="warning">
              <span className="text-sm">
                {isFollowerOnlyReferenceModule
                  ? t`Only subscribers can comment on this publication`
                  : isDegreesOfSeparationReferenceModule
                  ? `Only subscribers within ${video.by.handle}'s preferred network can comment`
                  : null}
              </span>
            </Alert>
          ) : null}
          {!comments?.length && !queuedComments.length ? (
            <span className="py-5">
              <NoDataFound
                text={t`Be the first to comment`}
                withImage
                isCenter
              />
            </span>
          ) : null}
          {!error && (queuedComments.length || comments?.length) ? (
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
                  (comment) =>
                    !comment.isHidden && (
                      <RenderComment
                        key={`${comment?.id}_${comment.createdAt}`}
                        comment={comment as Comment}
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
