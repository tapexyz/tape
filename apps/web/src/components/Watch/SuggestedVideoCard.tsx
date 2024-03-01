import HoverableProfile from '@components/Common/HoverableProfile';
import PublicationOptions from '@components/Common/Publication/PublicationOptions';
import { tw, useAverageColor } from '@dragverse/browser';
import {
  FALLBACK_THUMBNAIL_URL,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@dragverse/constants';
import {
  formatNumber,
  getIsSensitiveContent,
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from '@dragverse/generic';
import type { MirrorablePublication } from '@dragverse/lens';
import { CommentOutline, HeartOutline } from '@dragverse/ui';
import { getShortHandTime, getTimeFromSeconds } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

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
            href={`/watch/${video.id}`}
            className="cursor-pointer rounded-md"
          >
            <div className="relative">
              <img
                className={tw(
                  'h-24 w-44 bg-gray-300 object-center dark:bg-gray-700',
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
                  currentTarget.src = FALLBACK_THUMBNAIL_URL
                }}
              />
              {!isSensitiveContent && videoDuration ? (
                <div>
                  <span className="bg-brand-850 absolute bottom-1 right-1 rounded px-1 text-[10px] text-white">
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
                href={`/watch/${video.id}`}
                className="line-clamp-2 font-medium"
                title={getPublicationData(video.metadata)?.title ?? ''}
              >
                {getPublicationData(video.metadata)?.title}
              </Link>
            </div>
            <div className="py-1 text-sm">
              <HoverableProfile profile={video.by} />
            </div>
            <div className="flex items-center overflow-hidden text-xs opacity-80">
              <div className="flex items-center gap-1">
                <HeartOutline className="size-2.5" />
                {formatNumber(video.stats?.reactions)}
              </div>
              <span className="middot" />
              <div className="flex items-center gap-1">
                <CommentOutline className="size-2.5" />
                {formatNumber(video.stats?.comments)}
              </div>
              <span className="middot" />
              <span>{getShortHandTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <PublicationOptions publication={video} />
      </div>
    </div>
  )
}

export default React.memo(SuggestedVideoCard)
