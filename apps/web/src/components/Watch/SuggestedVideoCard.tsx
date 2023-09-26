import HoverableProfile from '@components/Common/HoverableProfile'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { useAverageColor } from '@lenstube/browser'
import {
  FALLBACK_COVER_URL,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@lenstube/constants'
import {
  formatNumber,
  getIsSensitiveContent,
  getShortHandTime,
  getThumbnailUrl,
  getTimeFromSeconds,
  getValueFromTraitType,
  imageCdn
} from '@lenstube/generic'
import type { Attribute, MirrorablePublication } from '@lenstube/lens'
import { Box, Flex } from '@radix-ui/themes'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  video: MirrorablePublication
}

const SuggestedVideoCard: FC<Props> = ({ video }) => {
  const [showReport, setShowReport] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const thumbnailUrl = isSensitiveContent
    ? `${STATIC_ASSETS}/images/sensor-blur.png`
    : getThumbnailUrl(video, true)

  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)
  const videoDuration = getValueFromTraitType(
    video.metadata.marketplace?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="group flex justify-between">
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        video={video}
        show={showReport}
        setShowReport={setShowReport}
      />
      <div className="flex justify-between">
        <div className="flex-none overflow-hidden rounded-md">
          <Link
            href={`/watch/${video.id}`}
            className="cursor-pointer rounded-md"
          >
            <div className="relative">
              <img
                className={clsx(
                  'h-20 w-36 bg-gray-300 object-center transition-all duration-500 hover:scale-105 dark:bg-gray-700',
                  isBytesVideo ? 'object-contain' : 'object-cover'
                )}
                src={imageCdn(
                  thumbnailUrl,
                  isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
                )}
                style={{ backgroundColor: `${backgroundColor}95` }}
                alt="thumbnail"
                draggable={false}
                onError={({ currentTarget }) => {
                  currentTarget.src = FALLBACK_COVER_URL
                }}
              />
              {!isSensitiveContent && videoDuration ? (
                <div>
                  <span className="absolute bottom-1 right-1 rounded bg-black px-1 text-[10px] text-white">
                    {getTimeFromSeconds(videoDuration)}
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
                href={`/watch/${video.id}`}
                className="line-clamp-2 text-sm font-medium"
                title={video.metadata.marketplace?.name ?? ''}
              >
                {video.metadata.marketplace?.name}
              </Link>
            </div>
            <div className="py-0.5">
              <HoverableProfile profile={video.by} fontSize="1" hideImage />
            </div>
            <div className="flex items-center overflow-hidden text-xs opacity-80">
              <Flex align="center" gap="1">
                <HeartOutline className="h-2.5 w-2.5" />
                {formatNumber(video.stats?.reactions)}
              </Flex>
              <span className="middot" />
              <Flex align="center" gap="1">
                <CommentOutline className="h-2.5 w-2.5" />
                {formatNumber(video.stats?.comments)}
              </Flex>
              <span className="middot" />
              <span>{getShortHandTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <Box>
        <VideoOptions
          video={video}
          setShowReport={setShowReport}
          setShowShare={setShowShare}
        />
      </Box>
    </div>
  )
}

export default React.memo(SuggestedVideoCard)
