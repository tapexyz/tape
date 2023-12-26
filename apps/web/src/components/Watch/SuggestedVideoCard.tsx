import type { MirrorablePublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import HoverableProfile from '@components/Common/HoverableProfile'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import PublicationOptions from '@components/Common/Publication/PublicationOptions'
import { getShortHandTime, getTimeFromSeconds } from '@lib/formatTime'
import { Box, Flex } from '@radix-ui/themes'
import { useAverageColor } from '@tape.xyz/browser'
import {
  FALLBACK_THUMBNAIL_URL,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@tape.xyz/constants'
import {
  formatNumber,
  getIsSensitiveContent,
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@tape.xyz/generic'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

type Props = {
  video: MirrorablePublication
}

const SuggestedVideoCard: FC<Props> = ({ video }) => {
  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const thumbnailUrl = isSensitiveContent
    ? `${STATIC_ASSETS}/images/sensor-blur.webp`
    : getThumbnailUrl(video.metadata, true)

  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)
  const videoDuration = getPublicationData(video.metadata)?.asset?.duration

  return (
    <div className="group flex justify-between">
      <div className="flex justify-between">
        <div className="rounded-small flex-none overflow-hidden">
          <Link
            className="cursor-pointer rounded-md"
            href={`/watch/${video.id}`}
          >
            <div className="relative">
              <img
                alt="thumbnail"
                className={clsx(
                  'h-24 w-44 bg-gray-300 object-center dark:bg-gray-700',
                  isBytesVideo ? 'object-contain' : 'object-cover'
                )}
                draggable={false}
                onError={({ currentTarget }) => {
                  currentTarget.src = FALLBACK_THUMBNAIL_URL
                }}
                src={imageCdn(
                  thumbnailUrl,
                  isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
                )}
                style={{ backgroundColor: `${backgroundColor}95` }}
              />
              {!isSensitiveContent && videoDuration ? (
                <div>
                  <span className="absolute bottom-1 right-1 rounded bg-black px-1 text-[10px] text-white">
                    {getTimeFromSeconds(String(videoDuration))}
                  </span>
                </div>
              ) : null}
            </div>
          </Link>
        </div>
        <div className="overflow-hidden px-2.5">
          <div className="flex flex-col items-start pb-1">
            <div className="grid w-full overflow-hidden break-words">
              <Link
                className="line-clamp-2 font-medium"
                href={`/watch/${video.id}`}
                title={getPublicationData(video.metadata)?.title ?? ''}
              >
                {getPublicationData(video.metadata)?.title}
              </Link>
            </div>
            <div className="py-1">
              <HoverableProfile fontSize="1" profile={video.by} />
            </div>
            <div className="flex items-center overflow-hidden text-xs opacity-80">
              <Flex align="center" gap="1">
                <HeartOutline className="size-2.5" />
                {formatNumber(video.stats?.reactions)}
              </Flex>
              <span className="middot" />
              <Flex align="center" gap="1">
                <CommentOutline className="size-2.5" />
                {formatNumber(video.stats?.comments)}
              </Flex>
              <span className="middot" />
              <span>{getShortHandTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <Box pt="2">
        <PublicationOptions publication={video} />
      </Box>
    </div>
  )
}

export default React.memo(SuggestedVideoCard)
