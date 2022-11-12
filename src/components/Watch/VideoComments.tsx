import { useQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { AiOutlineComment } from 'react-icons/ai'
import { PaginatedResultInfo, ProfileCommentsDocument } from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

import NewComment from './NewComment'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: LenstubePublication
}

const request = {
  limit: 30,
  customFilters: LENS_CUSTOM_FILTERS
}

const VideoComments: FC<Props> = ({ video }) => {
  const {
    query: { id }
  } = useRouter()
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const [comments, setComments] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore, refetch } = useQuery(
    ProfileCommentsDocument,
    {
      variables: {
        request: {
          ...request,
          commentsOf: id
        },
        reactionRequest: selectedChannel
          ? { profileId: selectedChannel?.id }
          : null,
        channelId: selectedChannel?.id ?? null
      },
      skip: !id,
      onCompleted(data) {
        setPageInfo(data?.publications?.pageInfo)
        setComments(data?.publications?.items as LenstubePublication[])
      }
    }
  )

  const refetchComments = () => {
    refetch({
      request: {
        commentsOf: id,
        ...request
      },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    })
  }

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              commentsOf: id,
              cursor: pageInfo?.next,
              ...request
            },
            reactionRequest: selectedChannel
              ? { profileId: selectedChannel?.id }
              : null,
            customFilters: LENS_CUSTOM_FILTERS,
            channelId: selectedChannel?.id ?? null
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setComments([
          ...comments,
          ...(data?.publications?.items as LenstubePublication[])
        ])
      } catch {}
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
