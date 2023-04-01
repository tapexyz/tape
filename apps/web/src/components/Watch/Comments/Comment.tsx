import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import HashExplorerLink from '@components/Common/Links/HashExplorerLink'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import Tooltip from '@components/UIElements/Tooltip'
import clsx from 'clsx'
import type { Attribute, Publication } from 'lens'
import { PublicationMainFocus } from 'lens'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'utils'
import { getRelativeTime } from 'utils/functions/formatTime'
import {
  checkValueInAttributes,
  getValueFromTraitType
} from 'utils/functions/getFromAttributes'
import getProfilePicture from 'utils/functions/getProfilePicture'

import NewComment from './NewComment'

const CommentOptions = dynamic(() => import('./CommentOptions'))
const PublicationReaction = dynamic(() => import('../PublicationReaction'))

interface Props {
  comment: Publication
}

const VideoComment: FC<Props> = ({ comment }) => {
  return (
    <div className="my-2 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800">
      <Link
        href={`/watch/${comment.id}`}
        className="flex items-center space-x-2.5"
      >
        <img
          src={`${STATIC_ASSETS}/images/brand/circle-blue-72x72.png`}
          className="h-5 w-5"
          draggable={false}
          alt="lenstube"
        />
        <span>Watch Video</span>
      </Link>
    </div>
  )
}

const Comment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showNewComment, setShowNewComment] = useState(false)

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
    <div className="flex items-start justify-between">
      <div className="flex w-full items-start">
        <Link
          href={`/channel/${comment.profile?.handle}`}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(comment.profile, 'avatar')}
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
            {getIsVideoComment() ? (
              <VideoComment comment={comment} />
            ) : (
              <InterweaveContent content={comment?.metadata?.content} />
            )}
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
                    Show more <ChevronDownOutline className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Show less <ChevronUpOutline className="ml-1 h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          )}
          {!comment.hidden && (
            <div className="mt-2 flex items-center space-x-4">
              <PublicationReaction publication={comment} />
              <button
                onClick={() => setShowNewComment(!showNewComment)}
                className="inline-flex items-center space-x-1.5 text-xs focus:outline-none"
              >
                <ReplyOutline className="h-3.5 w-3.5" /> <span>Reply</span>
              </button>
              {comment.stats.totalAmountOfComments ? (
                <button className="rounded-full bg-indigo-100 px-2 py-1 text-xs focus:outline-none dark:bg-indigo-900">
                  {comment.stats.totalAmountOfComments} replies
                </button>
              ) : null}
            </div>
          )}
          {showNewComment && (
            <div className="w-full pt-6">
              <NewComment video={comment} />
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
        <CommentOptions comment={comment} setShowReport={setShowReport} />
      </div>
    </div>
  )
}

export default Comment
