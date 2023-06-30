import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import HashExplorerLink from '@components/Common/Links/HashExplorerLink'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import Tooltip from '@components/UIElements/Tooltip'
import {
  checkValueInAttributes,
  getProfilePicture,
  getRelativeTime,
  getValueFromTraitType,
  trimLensHandle
} from '@lenstube/generic'
import type { Attribute, Publication } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import PublicationReaction from '../PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'
import CommentReplies from './CommentReplies'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

interface Props {
  comment: Publication
}

const Comment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showNewComment, setShowNewComment] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [defaultComment, setDefaultComment] = useState('')
  const { openConnectModal } = useConnectModal()

  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )

  useEffect(() => {
    if (comment?.metadata?.content.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.content])

  const getIsReplyQueuedComment = () => {
    return Boolean(queuedComments.filter((c) => c.pubId === comment.id)?.length)
  }

  return (
    <div className="flex items-start justify-between">
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
              <span>{trimLensHandle(comment?.profile?.handle)}</span>
              <IsVerified id={comment?.profile.id} />
            </Link>
            {checkValueInAttributes(
              comment?.metadata.attributes as Attribute[],
              'tip'
            ) && (
              <Tooltip placement="top" content="Tipper">
                <span>
                  <HashExplorerLink
                    hash={
                      getValueFromTraitType(
                        comment?.metadata.attributes as Attribute[],
                        'hash'
                      ) || ''
                    }
                  >
                    <HeartOutline className="h-3 w-3 text-red-500" />
                  </HashExplorerLink>
                </span>
              </Tooltip>
            )}
            <span className="text-xs opacity-70">
              {getRelativeTime(comment.createdAt)}
            </span>
          </span>
          <div className={clsx({ 'line-clamp-2': clamped })}>
            <InterweaveContent content={comment?.metadata?.content} />
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
          {!comment.hidden && (
            <div className="mt-2 flex items-center space-x-4">
              <PublicationReaction publication={comment} />
              <button
                onClick={() => {
                  if (!selectedChannelId) {
                    return openConnectModal?.()
                  }
                  setShowNewComment(!showNewComment)
                  setDefaultComment('')
                }}
                className="inline-flex items-center space-x-1.5 text-xs focus:outline-none"
              >
                <ReplyOutline className="h-3.5 w-3.5" />{' '}
                <span>
                  <Trans>Reply</Trans>
                </span>
              </button>
              {comment.stats.totalAmountOfComments ? (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="rounded-full bg-indigo-100 px-2 py-1 text-xs focus:outline-none dark:bg-indigo-900/30"
                >
                  {comment.stats.totalAmountOfComments} <Trans>replies</Trans>
                </button>
              ) : null}
            </div>
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
                  if (!selectedChannelId) {
                    return openConnectModal?.()
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
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <ReportModal
          video={comment}
          show={showReport}
          setShowReport={setShowReport}
        />
        <CommentOptions comment={comment} setShowReport={setShowReport} />
      </div>
    </div>
  )
}

export default Comment
