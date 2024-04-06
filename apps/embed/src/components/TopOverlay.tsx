import {
  STATIC_ASSETS,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  EVENTS,
  getLennyPicture,
  getProfile,
  getProfilePicture,
  getPublicationData,
  Tower
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type OverlayProps = {
  video: PrimaryPublication
}

const TopOverlay: FC<OverlayProps> = ({ video }) => {
  return (
    <div className="absolute top-0 z-10 w-full text-white">
      <div className="flex items-center justify-between space-x-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent pb-6 pl-3.5 pt-3.5">
        <div className="flex flex-1 items-center">
          <Link
            className="mr-3 flex-none cursor-pointer"
            href={`${TAPE_WEBSITE_URL}/u/${getProfile(video.by)?.slug}`}
            target="_blank"
            onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_PROFILE)}
          >
            <img
              src={getProfilePicture(video.by, 'AVATAR')}
              className="size-9 rounded-full"
              onError={({ currentTarget }) => {
                currentTarget.src = getLennyPicture(video.by?.id)
              }}
              alt={getProfile(video.by)?.slug}
              draggable={false}
            />
          </Link>
          <div className="flex flex-col">
            <Link
              className="line-clamp-1 break-words leading-5"
              href={`${TAPE_WEBSITE_URL}/watch/${video?.id}`}
              target="_blank"
              onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_TITLE)}
            >
              <h1 className="font-bold md:text-lg">
                {getPublicationData(video.metadata)?.title}
              </h1>
            </Link>
            <Link
              className="line-clamp-1 break-words leading-3"
              href={`${TAPE_WEBSITE_URL}/u/${getProfile(video.by)?.slug}`}
              target="_blank"
              onClick={() =>
                Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_PROFILE)
              }
            >
              <span className="text-sm">{getProfile(video.by)?.slug}</span>
            </Link>
          </div>
        </div>
        <Link
          className="flex items-center space-x-1.5 rounded-l-full bg-black/50 px-3 py-1.5 text-white"
          title={`Open ${TAPE_APP_NAME}`}
          href={`${TAPE_WEBSITE_URL}/watch/${video?.id}`}
          target="_blank"
          onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_WATCH_ON_TAPE)}
        >
          <img
            src={`${STATIC_ASSETS}/brand/logo.svg`}
            draggable={false}
            className="ml-2 size-5 md:size-7"
            alt={TAPE_APP_NAME}
            width={40}
          />
          <b>Watch on Tape</b>
        </Link>
      </div>
    </div>
  )
}

export default TopOverlay
