import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'utils'
import { LENSTUBE_WEBSITE_URL, STATIC_ASSETS } from 'utils/constants'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: LenstubePublication
}

const VideoOverlay: FC<Props> = ({ video }) => {
  return (
    <div className="absolute top-0 z-10 w-full text-white">
      <div className="flex items-center justify-between p-2 space-x-6 bg-gradient-to-b via-black/60 to-transparent from-black/90">
        <div className="flex items-center flex-1">
          <Link
            href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile?.handle}`}
            className="flex-none mr-3 cursor-pointer"
            target="_blank"
          >
            <img
              src={getProfilePicture(video?.profile)}
              className="w-9 h-9 rounded-full"
              draggable={false}
              alt={video?.profile?.handle}
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
              className="break-words line-clamp-1 leading-5"
              target="_blank"
            >
              <h1 className="font-semibold">{video?.metadata.name}</h1>
            </Link>
            <Link
              href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile.handle}`}
              className="leading-3 break-words line-clamp-1"
              target="_blank"
            >
              <span className="text-xs font-medium opacity-90">
                {video?.profile.handle}
              </span>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-self-end">
          <Link
            title="Watch on LensTube"
            className="flex items-center space-x-1.5"
            href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
            target="_blank"
          >
            <img
              src={`${STATIC_ASSETS}/images/brand/bg-black.png`}
              draggable={false}
              className="w-8 h-8 ml-0.5 rounded-full"
              alt="lenstube"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

VideoOverlay.displayName = 'VideoOverlay'

export default VideoOverlay
