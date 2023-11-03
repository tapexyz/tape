import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS
} from '@tape.xyz/constants'
import { getProfile } from '@tape.xyz/generic'
import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@tape.xyz/lens'
import {
  CommentRankingFilterType,
  LimitType,
  TriStateValue,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
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
  const { activeProfile, selectedCommentFilter } = useProfileStore()
  const queuedComments = usePersistStore((state) => state.queuedComments)

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const isDegreesOfSeparationReferenceModule =
    video?.referenceModule?.__typename ===
    'DegreesOfSeparationReferenceModuleSettings'

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      commentOn: {
        id: video.id,
        ranking: {
          filter:
            selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS
              ? CommentRankingFilterType.Relevant
              : CommentRankingFilterType.NoneRelevant
        }
      }
    }
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !video.id
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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
    activeProfile?.id &&
    (isFollowerOnlyReferenceModule || isDegreesOfSeparationReferenceModule)

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <>
            <h1 className="m-2 flex items-center space-x-2 text-lg">
              <CommentOutline className="h-5 w-5" />
              <span className="font-medium">
                Comments{' '}
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
          {video?.operations.canComment !== TriStateValue.No ? (
            <NewComment video={video} />
          ) : showReferenceModuleAlert ? (
            <Alert variant="warning">
              <span className="text-sm">
                {isFollowerOnlyReferenceModule
                  ? `Only followers can comment on this publication`
                  : isDegreesOfSeparationReferenceModule
                  ? `Only followers within ${getProfile(video.by)
                      ?.displayName}'s preferred network can comment`
                  : null}
              </span>
            </Alert>
          ) : null}
          {!comments?.length && !queuedComments.length ? (
            <span className="py-5">
              <NoDataFound text="Be the first to comment" withImage isCenter />
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
