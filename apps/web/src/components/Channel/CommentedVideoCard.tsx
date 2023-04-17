import CommentOutline from '@components/Common/Icons/CommentOutline'
import IsVerified from '@components/Common/IsVerified'
import ThumbnailImage from '@components/Common/VideoCard/ThumbnailImage'
import Tooltip from '@components/UIElements/Tooltip'
import type { Attribute, Comment, Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import {
  getDateString,
  getRelativeTime,
  getTimeFromSeconds
} from 'utils/functions/formatTime'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getLensHandle from 'utils/functions/getLensHandle'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: Comment
}

const CommentedVideoCard: FC<Props> = ({ video }) => {
  const commentedOn = video.commentOn as Publication
  const isSensitiveContent = getIsSensitiveContent(
    commentedOn?.metadata,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    commentedOn?.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  const isCommentOfComment = commentedOn.__typename === 'Comment'

  if (isCommentOfComment) {
    return null
  }

  return (
    <div className="group overflow-hidden rounded-xl">
      <Link href={`/watch/${commentedOn?.id}`}>
        <div className="aspect-w-16 aspect-h-8 relative rounded-xl">
          <ThumbnailImage video={commentedOn} />
          {isSensitiveContent && (
            <div className="absolute left-3 top-2">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-black">
                Sensitive Content
              </span>
            </div>
          )}
          {!isSensitiveContent && videoDuration ? (
            <div>
              <span className="absolute bottom-2 right-2 rounded bg-black px-1 py-0.5 text-xs text-white">
                {getTimeFromSeconds(videoDuration)}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <Link
            href={`/channel/${getLensHandle(commentedOn.profile?.handle)}`}
            className="mt-0.5 flex-none"
          >
            <img
              className="h-8 w-8 rounded-full"
              src={getProfilePicture(commentedOn?.profile, 'avatar')}
              alt={getLensHandle(commentedOn?.profile?.handle)}
              draggable={false}
            />
          </Link>
          <div className="grid-col grid flex-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <Link
                className="line-clamp-1 break-words text-[15px] font-medium opacity-80"
                href={`/watch/${commentedOn.id}`}
                title={commentedOn.metadata?.name ?? ''}
              >
                {commentedOn.metadata?.name}
              </Link>
            </div>
            <Link
              href={`/channel/${getLensHandle(commentedOn.profile?.handle)}`}
              className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70 hover:opacity-100"
            >
              <span>{commentedOn.profile?.handle}</span>
              <IsVerified id={commentedOn.profile?.id} size="xs" />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden pb-1.5 pt-2 text-sm opacity-90">
          <div className="absolute inset-0 bottom-5 left-3 flex w-1.5 justify-center pb-2">
            <div className="pointer-events-none w-0.5 bg-gray-300 dark:bg-gray-700" />
          </div>
          <Tooltip content="Commented">
            <span className="absolute bottom-1 m-2 opacity-70">
              <CommentOutline className="h-3.5 w-3.5" />
            </span>
          </Tooltip>
          <div className="pl-8">
            <div className="line-clamp-1 text-xs">
              {video.metadata?.content}
            </div>
            <div className="flex items-center text-xs leading-3 opacity-70">
              <span title={getDateString(video.createdAt)}>
                {getRelativeTime(video.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CommentedVideoCard)
