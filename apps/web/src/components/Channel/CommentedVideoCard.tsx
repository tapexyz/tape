import CommentOutline from '@components/Common/Icons/CommentOutline'
import IsVerified from '@components/Common/IsVerified'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@utils/analytics'
import { STATIC_ASSETS } from '@utils/constants'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { getValueFromTraitType } from '@utils/functions/getFromAttributes'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Attribute } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

const CommentedVideoCard: FC<Props> = ({ video }) => {
  const commentedOn = video.commentOn as LenstubePublication
  const isSensitiveContent = getIsSensitiveContent(
    commentedOn.metadata,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    commentedOn.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div
      onClick={() => Analytics.track(TRACK.CLICK_VIDEO)}
      className="overflow-hidden group rounded-xl"
    >
      <Link href={`/watch/${commentedOn.id}`}>
        <div className="relative rounded-xl aspect-w-16 aspect-h-8">
          <img
            src={imageCdn(
              isSensitiveContent
                ? `${STATIC_ASSETS}/images/sensor-blur.png`
                : getThumbnailUrl(commentedOn),
              'thumbnail'
            )}
            alt="cover"
            draggable={false}
            className="object-cover object-center w-full h-full rounded-xl lg:w-full lg:h-full"
          />
          {isSensitiveContent && (
            <div className="absolute top-2 left-3">
              <span className="py-0.5 text-[10px] px-2 text-black bg-white rounded-full">
                Sensitive Content
              </span>
            </div>
          )}
          {!isSensitiveContent && videoDuration ? (
            <div>
              <span className="py-0.5 absolute bottom-2 right-2 text-xs px-1 text-white bg-black rounded">
                {getTimeFromSeconds(videoDuration)}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <Link
            href={`/${commentedOn.profile?.handle}`}
            className="flex-none mt-0.5"
          >
            <img
              className="w-8 h-8 rounded-xl"
              src={getProfilePicture(commentedOn?.profile, 'avatar')}
              alt={commentedOn?.profile?.handle}
              draggable={false}
            />
          </Link>
          <div className="grid flex-1 grid-col">
            <div className="flex w-full items-start justify-between space-x-1.5 min-w-0">
              <Link
                href={`/watch/${commentedOn.id}`}
                className="font-medium text-[15px] line-clamp-1 opacity-80 break-words"
              >
                {commentedOn.metadata?.name}
              </Link>
            </div>
            <Link
              href={`/${commentedOn.profile?.handle}`}
              className="flex w-fit items-center text-[13px] space-x-0.5 hover:opacity-100 opacity-70"
            >
              <span>{commentedOn.profile?.handle}</span>
              <IsVerified id={commentedOn.profile?.id} size="xs" />
            </Link>
          </div>
        </div>
        <div className="relative pb-1.5 pt-2 overflow-hidden text-sm opacity-90">
          <div className="absolute left-3 bottom-5 pb-2 inset-0 flex justify-center w-1.5">
            <div className="w-0.5 bg-gray-300 dark:bg-gray-700 pointer-events-none" />
          </div>
          <Tooltip content="Commented">
            <span className="absolute m-2 bottom-1 opacity-70">
              <CommentOutline className="w-3.5 h-3.5" />
            </span>
          </Tooltip>
          <div className="pl-8">
            <div className="text-xs line-clamp-1">
              {video.metadata?.content}
            </div>
            <div className="flex items-center text-xs leading-3 opacity-70">
              <span title={video.createdAt}>
                {dayjs(new Date(video.createdAt)).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentedVideoCard
