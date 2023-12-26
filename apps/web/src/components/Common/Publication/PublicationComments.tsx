import type {
  AnyPublication,
  Comment,
  MirrorablePublication,
  PublicationsRequest
} from '@tape.xyz/lens'
import type { FC } from 'react'

import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useCommentStore from '@lib/store/comment'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import {
  INFINITE_SCROLL_ROOT_MARGIN,
  LENS_CUSTOM_FILTERS
} from '@tape.xyz/constants'
import { getProfile } from '@tape.xyz/generic'
import {
  CommentRankingFilterType,
  LimitType,
  TriStateValue,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { CustomCommentsFilterEnum } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

import CommentsFilter from '../../Watch/Comments/CommentsFilter'
import NewComment from '../../Watch/Comments/NewComment'
import QueuedComment from '../../Watch/Comments/QueuedComment'
import RenderComment from '../../Watch/Comments/RenderComment'

type Props = {
  hideTitle?: boolean
  publication: MirrorablePublication
}

const PublicationComments: FC<Props> = ({ hideTitle = false, publication }) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const selectedCommentFilter = useCommentStore(
    (state) => state.selectedCommentFilter
  )
  const queuedComments = usePersistStore((state) => state.queuedComments)

  const isFollowerOnlyReferenceModule =
    publication?.referenceModule?.__typename ===
    'FollowOnlyReferenceModuleSettings'

  const isDegreesOfSeparationReferenceModule =
    publication?.referenceModule?.__typename ===
    'DegreesOfSeparationReferenceModuleSettings'

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      commentOn: {
        id: publication.id,
        ranking: {
          filter:
            selectedCommentFilter === CustomCommentsFilterEnum.RELEVANT_COMMENTS
              ? CommentRankingFilterType.Relevant
              : CommentRankingFilterType.NoneRelevant
        }
      },
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    skip: !publication.id,
    variables: { request }
  })

  const comments = data?.publications?.items as AnyPublication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  const showReferenceModuleAlert =
    activeProfile?.id &&
    (isFollowerOnlyReferenceModule || isDegreesOfSeparationReferenceModule)

  return (
    <>
      <div className="flex items-center justify-between">
        {!hideTitle && (
          <>
            <h1 className="my-2 flex items-center space-x-2 text-lg">
              <CommentOutline className="size-5" />
              <span className="font-medium">
                Comments{' '}
                {publication.stats.comments
                  ? `( ${publication.stats.comments} )`
                  : null}
              </span>
            </h1>
            <CommentsFilter />
          </>
        )}
      </div>
      {loading && <CommentsShimmer />}
      {!loading && publication ? (
        <>
          {publication?.operations.canComment !== TriStateValue.No ? (
            <NewComment video={publication} />
          ) : showReferenceModuleAlert ? (
            <Alert variant="warning">
              <span className="text-sm">
                {isFollowerOnlyReferenceModule
                  ? `Only followers can comment on this publication`
                  : isDegreesOfSeparationReferenceModule
                    ? `Only followers within ${getProfile(publication.by)
                        ?.displayName}'s preferred network can comment`
                    : null}
              </span>
            </Alert>
          ) : null}
          {!comments?.length && !queuedComments.length ? (
            <span className="py-5">
              <NoDataFound isCenter text="Be the first to comment" withImage />
            </span>
          ) : null}
          {!error && (queuedComments.length || comments?.length) ? (
            <>
              <div className="space-y-4 py-4">
                {queuedComments?.map(
                  (queuedComment) =>
                    queuedComment?.pubId === publication?.id && (
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
                        comment={comment as Comment}
                        key={`${comment?.id}_${comment.createdAt}`}
                      />
                    )
                )}
              </div>
              {pageInfo?.next && (
                <span className="flex justify-center p-10" ref={observe}>
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

export default PublicationComments
