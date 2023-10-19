import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { getShortHandTime } from '@lib/formatTime'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import { Button, Flex } from '@radix-ui/themes'
import {
  getProfile,
  getProfilePicture,
  getValueFromKeyInAttributes
} from '@tape.xyz/generic'
import type { Comment } from '@tape.xyz/lens'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import PublicationReaction from '../PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'
import CommentReplies from './CommentReplies'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

interface Props {
  comment: Comment
}

const RenderComment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showNewComment, setShowNewComment] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [defaultComment, setDefaultComment] = useState('')
  const handleWrongNetwork = useHandleWrongNetwork()

  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  useEffect(() => {
    if (comment?.metadata?.marketplace?.description.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata])

  const getIsReplyQueuedComment = () => {
    return Boolean(queuedComments.filter((c) => c.pubId === comment.id)?.length)
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex w-full items-start">
        <Link
          href={`/u/${getProfile(comment.by)?.slug}`}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(comment.by, 'AVATAR')}
            className="h-7 w-7 rounded-full"
            draggable={false}
            alt={getProfile(comment.by)?.slug}
          />
        </Link>
        <div className="mr-2 flex w-full flex-col items-start">
          <span className="mb-1 flex items-center">
            <HoverableProfile profile={comment.by}>
              <Link
                href={getProfile(comment.by)?.link}
                className="flex items-center space-x-1 text-sm font-medium"
              >
                <span>{getProfile(comment.by)?.slug}</span>
                <Badge id={comment?.by.id} />
              </Link>
            </HoverableProfile>
            {getValueFromKeyInAttributes(
              comment?.metadata?.attributes as MetadataAttribute[],
              'hash'
            ) && (
              <Tooltip placement="top" content="Supporter">
                <span className="pl-2">
                  <HeartOutline className="h-3 w-3 text-red-500" />
                </span>
              </Tooltip>
            )}
            <span className="middot" />
            <span className="text-xs opacity-70">
              {getShortHandTime(comment.createdAt)}
            </span>
          </span>
          <div className={clsx({ 'line-clamp-2': clamped })}>
            <InterweaveContent
              content={comment?.metadata?.marketplace?.description}
            />
          </div>
          {showMore && (
            <div className="mt-3 inline-flex">
              <button
                type="button"
                onClick={() => setClamped(!clamped)}
                className="mt-2 flex items-center text-xs opacity-80 outline-none hover:opacity-100"
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
          {!comment.isHidden && (
            <Flex mt="2" gap="4">
              <PublicationReaction publication={comment} />
              <Button
                variant="ghost"
                highContrast
                onClick={() => {
                  if (!selectedSimpleProfile?.id) {
                    return toast.error('Sign in to proceed')
                  }
                  if (handleWrongNetwork()) {
                    return
                  }
                  setShowNewComment(!showNewComment)
                  setDefaultComment('')
                }}
              >
                <ReplyOutline className="h-3.5 w-3.5" />
                <span className="text-xs">
                  <Trans>Reply</Trans>
                </span>
              </Button>
              {comment.stats.comments ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  <CommentOutline className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {comment.stats.comments} <Trans>replies</Trans>
                  </span>
                </Button>
              ) : null}
            </Flex>
          )}
          <div
            className={clsx(
              'w-full space-y-6',
              (showReplies || showNewComment || getIsReplyQueuedComment()) &&
                'pt-6'
            )}
          >
            {queuedComments?.map(
              (queuedComment) =>
                queuedComment?.pubId === comment?.id && (
                  <QueuedComment
                    key={queuedComment?.pubId}
                    queuedComment={queuedComment}
                  />
                )
            )}
            {showReplies && (
              <CommentReplies
                comment={comment}
                replyTo={(profile) => {
                  if (!selectedSimpleProfile?.id) {
                    return toast.error('Sign in to proceed')
                  }
                  if (handleWrongNetwork()) {
                    return
                  }
                  setShowNewComment(true)
                  setDefaultComment(`@${profile.handle} `)
                }}
              />
            )}
            {showNewComment && (
              <NewComment
                video={comment}
                defaultValue={defaultComment}
                placeholder={t`Write a reply`}
                hideEmojiPicker
                resetReply={() => {
                  setDefaultComment('')
                  setShowNewComment(false)
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <CommentOptions comment={comment} />
      </div>
    </div>
  )
}

export default RenderComment
