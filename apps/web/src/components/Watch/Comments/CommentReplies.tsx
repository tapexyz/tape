import Badge from '@components/Common/Badge'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Button } from '@components/UIElements/Button'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  getProfilePicture,
  getRelativeTime,
  trimLensHandle
} from '@lenstube/generic'
import type { Comment, Profile, PublicationsRequest } from '@lenstube/lens'
import { LimitType, usePublicationsQuery } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import PublicationReaction from '../PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'

type ReplyContentProps = {
  comment: Comment
}

const ReplyContent: FC<ReplyContentProps> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  useEffect(() => {
    if (comment?.metadata?.marketplace?.description.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.marketplace?.description])

  return (
    <>
      <div className={clsx({ 'line-clamp-2': clamped })}>
        <InterweaveContent
          content={comment?.metadata?.marketplace?.description}
        />
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
  comment: Comment
  replyTo: (profile: Profile) => void
}

const CommentReplies: FC<Props> = ({ comment, replyTo }) => {
  const request: PublicationsRequest = {
    limit: LimitType.Ten,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      commentOn: comment.id
    }
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !comment.id
  })

  const comments = data?.publications?.items as unknown as Comment[]
  const pageInfo = data?.publications?.pageInfo
  const hasMore = comments?.length > 10

  const loadMore = async () => {
    await fetchMore({
      variables: {
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
        (comment) =>
          !comment.isHidden && (
            <div key={comment.id} className="flex items-start justify-between">
              <div className="flex w-full items-start">
                <Link
                  href={`/channel/${trimLensHandle(comment.by?.handle)}`}
                  className="mr-3 mt-0.5 flex-none"
                >
                  <img
                    src={getProfilePicture(comment.by, 'AVATAR')}
                    className="h-7 w-7 rounded-full"
                    draggable={false}
                    alt={comment.by?.handle}
                  />
                </Link>
                <div className="mr-2 flex w-full flex-col items-start">
                  <span className="mb-1 flex items-center space-x-2">
                    <Link
                      href={`/channel/${trimLensHandle(comment.by?.handle)}`}
                      className="flex items-center space-x-1 text-sm font-medium"
                    >
                      <span>{trimLensHandle(comment?.by?.handle)}</span>
                      <Badge id={comment?.by.id} />
                    </Link>
                    <span className="text-xs opacity-70">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </span>
                  <ReplyContent comment={comment as Comment} />
                  {!comment.isHidden && (
                    <div className="mt-2 flex items-center space-x-4">
                      <PublicationReaction publication={comment} />
                      <button
                        onClick={() => replyTo(comment.by)}
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
                <CommentOptions comment={comment} />
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
