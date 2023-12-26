import type { FC } from 'react'

import Badge from '@components/Common/Badge'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { getShortHandTime } from '@lib/formatTime'
import { Button, Flex } from '@radix-ui/themes'
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
import clsx from 'clsx'
import Link from 'next/link'
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
      <div className={clsx({ 'line-clamp-2': clamped })}>
        <InterweaveContent content={content} />
      </div>
      {showMore && (
        <div className="inline-flex">
          <button
            className="my-2 flex items-center text-sm opacity-80 outline-none hover:opacity-100"
            onClick={() => setClamped(!clamped)}
            type="button"
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
      commentOn: {
        id: comment.id,
        ranking: {
          filter: CommentRankingFilterType.All
        }
      },
      customFilters: LENS_CUSTOM_FILTERS
    }
  }

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    skip: !comment.id,
    variables: { request }
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
            <div className="flex items-start justify-between" key={comment.id}>
              <div className="flex w-full items-start">
                <Link
                  className="mr-3 mt-0.5 flex-none"
                  href={`/u/${getProfile(comment.by)?.slug}`}
                >
                  <img
                    alt={getProfile(comment.by)?.slug}
                    className="size-8 rounded-full"
                    draggable={false}
                    src={getProfilePicture(comment.by, 'AVATAR')}
                  />
                </Link>
                <div className="mr-2 flex w-full flex-col items-start">
                  <span className="mb-1 flex items-center">
                    <Link
                      className="flex items-center space-x-1 font-medium"
                      href={getProfile(comment.by)?.link}
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
                    <Flex gap="4" mt="2">
                      <PublicationReaction publication={comment} />
                      <Button
                        highContrast
                        onClick={() => replyTo(comment.by)}
                        variant="ghost"
                      >
                        <ReplyOutline className="size-3.5" />{' '}
                        <span className="text-xs">Reply</span>
                      </Button>
                    </Flex>
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
          highContrast
          onClick={loadMore}
          variant="soft"
        >
          <span className="flex items-center space-x-2 opacity-70 group-hover:opacity-100">
            Show more replies
          </span>
        </Button>
      ) : null}
    </div>
  )
}

export default CommentReplies
