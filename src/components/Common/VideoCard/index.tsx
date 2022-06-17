import { STATIC_ASSETS } from '@utils/constants'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { LenstubePublication } from 'src/types/local'

import ShareModal from './ShareModal'
import VideoOptions from './VideoOptions'

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const isSensitiveContent = getIsSensitiveContent(video.metadata?.attributes)

  return (
    <Link href={`/watch/${video.id}`}>
      <a className="cursor-pointer bg-gray-50 rounded-xl dark:bg-[#181818] group">
        <ShareModal
          video={video}
          show={showShare}
          setShowShare={setShowShare}
        />
        <div className="relative rounded-t-xl aspect-w-16 aspect-h-9">
          <img
            src={imageCdn(
              isSensitiveContent
                ? `${STATIC_ASSETS}/images/sensor-blur.png`
                : getThumbnailUrl(video)
            )}
            draggable={false}
            className="object-cover object-center w-full h-full rounded-t-xl lg:w-full lg:h-full"
            alt=""
          />
          {isSensitiveContent && (
            <div className="absolute top-2 left-3">
              <span className="py-0.5 text-[10px] px-2 text-black bg-white rounded-full">
                Sensitive Content
              </span>
            </div>
          )}
        </div>
        <div className="p-2">
          <div className="flex items-start space-x-2.5">
            <div className="flex-none mt-0.5">
              <img
                className="w-8 h-8 rounded-xl"
                src={getProfilePicture(video.profile)}
                alt=""
                draggable={false}
              />
            </div>
            <div className="flex flex-col items-start flex-1 pb-1">
              <div className="flex w-full items-start justify-between space-x-1.5">
                <h3 className="text-[15px] font-medium line-clamp-2">
                  {video.metadata?.name}
                </h3>
                <VideoOptions video={video} setShowShare={setShowShare} />
              </div>
              <Link passHref href={`/${video.profile?.handle}`}>
                <div className="text-xs hover:opacity-100 opacity-70">
                  {video.profile?.handle}
                </div>
              </Link>
              <div className="flex overflow-hidden items-center space-x-1 text-[11px] opacity-70">
                <span className="whitespace-nowrap">
                  {video.stats.totalUpvotes} likes
                </span>
                <span className="middot" />
                <span className="whitespace-nowrap">
                  {dayjs(new Date(video.createdAt)).fromNow()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default VideoCard
