import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { getShortHandTime } from '@lib/formatTime'
import { tw } from '@tape.xyz/browser'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import {
  type Comment,
  CommentRankingFilterType,
  LimitType,
  type Profile,
  type PublicationsRequest,
  usePublicationsQuery
} from '@tape.xyz/lens'
import {
  ChevronDownOutline,
  ChevronUpOutline,
  ReplyOutline
} from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import PublicationReaction from '../../Common/Publication/PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'

type ReplyContentProps = {
  comment: Comment
}

const ReplyContent: FC<ReplyContentProps> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const content = getPublicationData(comment?.metadata)?.content || ''

  useEffect(() => {
    if (content && content.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [content])

  return (
    <>
      <div className={tw({ 'line-clamp-2': clamped })}>
        <InterweaveContent content={content} />
      </div>
      {showMore && (
        <div className="inline-flex">
          <button
            type="button"
            onClick={() => setClamped(!clamped)}
            className="my-2 flex items-center text-sm opacity-80 outline-none hover:opacity-100"
          >
            {clamped ? (
              <>
                Show more <ChevronDownOutline className="ml-1 size-3" />
              </>
            ) : (
              <>
                Show less <ChevronUpOutline className="ml-1 size-3" />
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
    limit: LimitType.Fifty,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      commentOn: {
        id: comment.id,
        ranking: {
          filter: CommentRankingFilterType.All
        }
      }
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
    <div className={tw(comments.length && 'space-y-6')}>
      {comments?.map(
        (comment) =>
          !comment.isHidden && (
            <div key={comment.id} className="flex items-start justify-between">
              <div className="flex w-full items-start">
                <Link
                  href={`/u/${getProfile(comment.by)?.slug}`}
                  className="mr-3 mt-0.5 flex-none"
                >
                  <img
                    src={getProfilePicture(comment.by, 'AVATAR')}
                    className="size-8 rounded-full"
                    draggable={false}
                    alt={getProfile(comment.by)?.slug}
                  />
                </Link>
                <div className="mr-2 flex w-full flex-col items-start">
                  <span className="mb-1 flex items-center">
                    <Link
                      href={getProfile(comment.by)?.link}
                      className="flex items-center space-x-1 font-medium"
                    >
                      <span>{getProfile(comment.by)?.slug}</span>
                      <Badge id={comment?.by.id} />
                    </Link>
                    <span className="middot" />
                    <span className="text-sm opacity-70">
                      {getShortHandTime(comment.createdAt)}
                    </span>
                  </span>
                  <ReplyContent comment={comment as Comment} />
                  {!comment.isHidden && (
                    <div className="mt-2 flex gap-4">
                      <PublicationReaction publication={comment} />
                      <button
                        className="flex items-center space-x-1 focus:outline-none"
                        onClick={() => replyTo(comment.by)}
                      >
                        <ReplyOutline className="size-3.5" />{' '}
                        <span className="text-xs">Reply</span>
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
        <button
          className="group flex w-full items-baseline space-x-2 text-center text-sm"
          onClick={loadMore}
        >
          <span className="opacity-70 group-hover:opacity-100">
            Show more replies
          </span>
          <ChevronDownOutline className="size-2" />
        </button>
      ) : null}
    </div>
  )
}

export default CommentReplies
