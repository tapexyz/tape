import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@components/UIElements/Button'
import useChannelStore from '@lib/store/channel'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { Profile, Publication } from 'lens'
import { PublicationMainFocus, useCommentsQuery } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { LENS_CUSTOM_FILTERS } from 'utils'
import { getRelativeTime } from 'utils/functions/formatTime'
import getProfilePicture from 'utils/functions/getProfilePicture'

import PublicationReaction from '../PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'

type ReplyContentProps = {
  comment: Publication
}

const ReplyContent: FC<ReplyContentProps> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  useEffect(() => {
    if (comment?.metadata?.content.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.content])

  const getIsVideoComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Video
  }

  return (
    <>
      <div className={clsx({ 'line-clamp-2': clamped })}>
        <InterweaveContent content={comment?.metadata?.content} />
      </div>
      {showMore && (
        <div className="inline-flex">
          <button
            type="button"
            onClick={() => setClamped(!clamped)}
            className="my-2 flex items-center text-xs opacity-80 outline-none hover:opacity-100"
          >
            {clamped ? (
              <>
                <Trans>Show more</Trans>{' '}
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                <Trans>Show less</Trans>{' '}
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              </>
            )}
          </button>
        </div>
      )}
      <CommentMedia comment={comment} />
    </>
  )
}

type Props = {
  comment: Publication
  replyTo: (profile: Profile) => void
}

const CommentReplies: FC<Props> = ({ comment, replyTo }) => {
  const [showReport, setShowReport] = useState(false)

  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const request = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: comment.id
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
    skip: !comment.id
  })

  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo
  const hasMore = comments?.length > 10

  const loadMore = async () => {
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

  if (loading) {
    return <CommentsShimmer />
  }

  if (error) {
    return null
  }

  return (
    <div className={clsx(comments.length && 'space-y-6')}>
      {comments?.map(
        (comment: Publication) =>
          !comment.hidden && (
            <div key={comment.id} className="flex items-start justify-between">
              <div className="flex w-full items-start">
                <Link
                  href={`/channel/${comment.profile?.handle}`}
                  className="mr-3 mt-0.5 flex-none"
                >
                  <img
                    src={getProfilePicture(comment.profile, 'AVATAR')}
                    className="h-7 w-7 rounded-full"
                    draggable={false}
                    alt={comment.profile?.handle}
                  />
                </Link>
                <div className="mr-2 flex w-full flex-col items-start">
                  <span className="mb-1 flex items-center space-x-2">
                    <Link
                      href={`/channel/${comment.profile?.handle}`}
                      className="flex items-center space-x-1 text-sm font-medium"
                    >
                      <span>{comment?.profile?.handle}</span>
                      <IsVerified id={comment?.profile.id} />
                    </Link>
                    <span className="text-xs opacity-70">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </span>
                  <ReplyContent comment={comment} />
                  {!comment.hidden && (
                    <div className="mt-2 flex items-center space-x-4">
                      <PublicationReaction publication={comment} />
                      <button
                        onClick={() => replyTo(comment.profile)}
                        className="inline-flex items-center space-x-1.5 text-xs focus:outline-none"
                      >
                        <ReplyOutline className="h-3.5 w-3.5" />{' '}
                        <span>
                          <Trans>Reply</Trans>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <ReportModal
                  video={comment}
                  show={showReport}
                  setShowReport={setShowReport}
                />
                <CommentOptions
                  comment={comment}
                  setShowReport={setShowReport}
                />
              </div>
            </div>
          )
      )}
      {pageInfo?.next && hasMore ? (
        <Button
          className="group w-full text-center"
          onClick={loadMore}
          variant="outline"
          size="lg"
        >
          <span className="flex items-center space-x-2 opacity-70 group-hover:opacity-100">
            <Trans>Show more replies</Trans>
          </span>
        </Button>
      ) : null}
    </div>
  )
}

export default CommentReplies
