import { LENSTUBE_WEBSITE_URL, STATIC_ASSETS } from '@lenstube/constants'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: Publication
  clicked: boolean
}

const VideoOverlay: FC<Props> = ({ video, clicked }) => {
  return (
    <div className="absolute top-0 z-10 w-full text-white">
      <div className="flex items-center justify-between space-x-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-3.5 pb-6">
        <div className="flex flex-1 items-center">
          <Link
            className="mr-3 flex-none cursor-pointer"
            href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile?.handle}`}
            target="_blank"
            // onClick={() =>
            //   Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_CHANNEL)
            // }
          >
            <img
              src={getProfilePicture(video?.profile)}
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={video?.profile?.handle}
            />
          </Link>
          <div className="flex flex-col">
            <Link
              className="line-clamp-1 break-words leading-5"
              href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
              // onClick={() =>
              //   Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_TITLE)
              // }
              target="_blank"
            >
              <h1 className="font-semibold md:text-lg">
                {video?.metadata.name}
              </h1>
            </Link>
            <Link
              className="line-clamp-1 break-words leading-3"
              href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile.handle}`}
              target="_blank"
              // onClick={() =>
              //   Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_CHANNEL)
              // }
            >
              <span className="text-sm">
                {trimLensHandle(video?.profile.handle)}
              </span>
            </Link>
          </div>
        </div>
        {clicked && (
          <div className="flex items-center justify-self-end">
            <Link
              className="flex items-center space-x-1.5"
              // onClick={() =>
              //   Analytics.track(TRACK.EMBED_VIDEO.WATCH_ON_LENSTUBE)
              // }
              title="Watch on LensTube"
              href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
              target="_blank"
            >
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
                draggable={false}
                className="ml-0.5 h-8 w-8 rounded-full"
                alt="lenstube"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

VideoOverlay.displayName = 'VideoOverlay'

export default VideoOverlay
