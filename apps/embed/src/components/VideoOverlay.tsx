import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { Analytics, TRACK } from 'utils'
import { LENSTUBE_WEBSITE_URL, STATIC_ASSETS } from 'utils/constants'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: Publication
  clicked: boolean
}

const VideoOverlay: FC<Props> = ({ video, clicked }) => {
  return (
    <div className="absolute top-0 z-10 w-full text-white">
      <div className="flex items-center justify-between p-3.5 space-x-6 bg-gradient-to-b via-black/40 to-transparent from-black/80">
        <div className="flex items-center flex-1">
          <Link
            className="flex-none mr-3 cursor-pointer"
            href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile?.handle}`}
            target="_blank"
            onClick={() =>
              Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_CHANNEL)
            }
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
              className="break-words line-clamp-1 leading-5"
              onClick={() =>
                Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_TITLE)
              }
              href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
              target="_blank"
            >
              <h1 className="font-semibold">{video?.metadata.name}</h1>
            </Link>
            <Link
              className="leading-3 break-words line-clamp-1"
              href={`${LENSTUBE_WEBSITE_URL}/channel/${video?.profile.handle}`}
              target="_blank"
              onClick={() =>
                Analytics.track(TRACK.EMBED_VIDEO.CLICK_EMBED_CHANNEL)
              }
            >
              <span className="text-xs font-medium opacity-90">
                {video?.profile.handle}
              </span>
            </Link>
          </div>
        </div>
        {clicked && (
          <div className="flex items-center justify-self-end">
            <Link
              className="flex items-center space-x-1.5"
              onClick={() =>
                Analytics.track(TRACK.EMBED_VIDEO.WATCH_ON_LENSTUBE)
              }
              title="Watch on LensTube"
              href={`${LENSTUBE_WEBSITE_URL}/watch/${video?.id}`}
              target="_blank"
            >
              <img
                src={`${STATIC_ASSETS}/images/brand/bg-indigo.png`}
                draggable={false}
                className="w-8 h-8 ml-0.5 rounded-full"
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
