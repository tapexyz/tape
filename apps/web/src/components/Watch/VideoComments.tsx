import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useProfileCommentsQuery } from 'lens'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import type { LenstubePublication } from 'utils'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils'

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

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const request = {
    limit: 30,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: id
  }
  const variables = {
    request,
    reactionRequest: selectedChannel
      ? { profileId: selectedChannel?.id }
      : null,
    channelId: selectedChannel?.id ?? null
  }

  const { data, loading, error, fetchMore, refetch } = useProfileCommentsQuery({
    variables,
    skip: !id
  })

  const comments = data?.publications?.items as LenstubePublication[]
  const pageInfo = data?.publications?.pageInfo

  const refetchComments = () => {
    refetch({
      ...variables
    })
  }

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

  if (loading) return <CommentsShimmer />

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center my-4 space-x-2 text-lg">
          <CommentOutline className="w-4 h-4" />
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
            {isFollowerOnlyReferenceModule
              ? 'Only subscribers can comment on this publication'
              : `Only subscribers within ${video.profile.handle}'s preferred network can comment`}
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
