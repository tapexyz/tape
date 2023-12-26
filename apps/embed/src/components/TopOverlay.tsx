import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { useCopyToClipboard } from '@tape.xyz/browser'
import {
  STATIC_ASSETS,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  EVENTS,
  getProfile,
  getProfilePicture,
  getPublicationData,
  Tower
} from '@tape.xyz/generic'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import CopyOutline from './icons/CopyOutline'

type OverlayProps = {
  playerRef: HTMLMediaElement | undefined
  video: PrimaryPublication
}

const TopOverlay: FC<OverlayProps> = ({ playerRef, video }) => {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const [copy] = useCopyToClipboard()

  useEffect(() => {
    if (playerRef) {
      playerRef.onpause = () => {
        setShowVideoOverlay(true)
      }
      playerRef.onplay = () => {
        setShowVideoOverlay(false)
      }
    }
  }, [playerRef])

  const onCopyVideoUrl = async () => {
    await copy(`${TAPE_WEBSITE_URL}/watch/${video.id}`)
    Tower.track(EVENTS.EMBED_VIDEO.CLICK_COPY_URL)
  }

  return (
    <div
      className={`${
        showVideoOverlay ? 'visible' : 'invisible'
      } transition-all duration-200 ease-in-out group-hover:visible`}
    >
      <div className="absolute top-0 z-10 w-full text-white">
        <div className="flex items-center justify-between space-x-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-3.5 pb-6">
          <div className="flex flex-1 items-center">
            <Link
              className="mr-3 flex-none cursor-pointer"
              href={`${TAPE_WEBSITE_URL}/u/${getProfile(video.by)?.slug}`}
              onClick={() =>
                Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_PROFILE)
              }
              target="_blank"
            >
              <img
                alt={getProfile(video.by)?.slug}
                className="size-9 rounded-full"
                draggable={false}
                src={getProfilePicture(video.by, 'AVATAR')}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                className="line-clamp-1 break-words leading-5"
                href={`${TAPE_WEBSITE_URL}/watch/${video?.id}`}
                onClick={() =>
                  Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_TITLE)
                }
                target="_blank"
              >
                <h1 className="font-bold md:text-lg">
                  {getPublicationData(video.metadata)?.title}
                </h1>
              </Link>
              <Link
                className="line-clamp-1 break-words leading-3"
                href={`${TAPE_WEBSITE_URL}/u/${getProfile(video.by)?.slug}`}
                onClick={() =>
                  Tower.track(EVENTS.EMBED_VIDEO.CLICK_EMBED_PROFILE)
                }
                target="_blank"
              >
                <span className="text-sm">{getProfile(video.by)?.slug}</span>
              </Link>
            </div>
          </div>
          <button
            className="invisible rounded-full bg-black/50 p-3 transition-all duration-200 ease-in-out group-hover:visible"
            onClick={() => onCopyVideoUrl()}
          >
            <CopyOutline className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 right-0 md:bottom-4">
        <Link
          className="rounded-l-small flex items-center space-x-1.5 bg-black/50 px-3 py-1.5 text-white"
          href={`${TAPE_WEBSITE_URL}/watch/${video?.id}`}
          onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_WATCH_ON_TAPE)}
          target="_blank"
          title={`Watch on ${TAPE_APP_NAME}`}
        >
          <img
            alt={TAPE_APP_NAME}
            className="ml-0.5 size-6 md:size-10"
            draggable={false}
            src={`${STATIC_ASSETS}/brand/logo.svg`}
          />
          <b>Watch on Tape</b>
        </Link>
      </div>
    </div>
  )
}

export default TopOverlay
