import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { useAverageColor } from '@tape.xyz/browser'
import {
  STATIC_ASSETS,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  EVENTS,
  getPublicationData,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl,
  Tower,
  truncate
} from '@tape.xyz/generic'
import AudioPlayer from '@tape.xyz/ui/AudioPlayer'
import Link from 'next/link'
import React, { useState } from 'react'

import PauseOutline from './icons/PauseOutline'
import PlayOutline from './icons/PlayOutline'
import MetaTags from './MetaTags'

type Props = {
  audio: PrimaryPublication
}

const Audio: FC<Props> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const coverImage = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata, true)),
    'SQUARE'
  )
  const { color: backgroundColor } = useAverageColor(coverImage, true)

  return (
    <>
      <MetaTags
        description={truncate(
          getPublicationData(audio.metadata)?.content as string,
          100
        )}
        image={coverImage}
        title={truncate(
          getPublicationData(audio.metadata)?.title as string,
          60
        )}
      />
      <div
        className="md:rounded-large rounded-small relative max-h-[350px] overflow-hidden p-4 md:p-6"
        style={{
          backgroundColor,
          backgroundImage: `url("${imageCdn(
            `${STATIC_ASSETS}/images/fallback-cover.svg`
          )}")`
        }}
      >
        <div className="flex items-center space-x-6">
          <Link
            className="rounded-small aspect-[1/1] w-[150px] flex-none shadow-2xl md:w-[250px]"
            href={`${TAPE_WEBSITE_URL}/listen/${audio?.id}`}
            onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_LISTEN_ON_TAPE)}
            title={`Listen on ${TAPE_APP_NAME}`}
          >
            <img
              alt="audio cover"
              className="rounded-small tape-border object-cover"
              draggable={false}
              height={500}
              src={coverImage}
              width={500}
            />
          </Link>
          <div className="w-full text-white md:space-y-4">
            <Link
              className="line-clamp-1 inline-block text-xl font-bold !leading-normal md:text-4xl"
              href={`${TAPE_WEBSITE_URL}/listen/${audio?.id}`}
              onClick={() =>
                Tower.track(EVENTS.EMBED_VIDEO.CLICK_LISTEN_ON_TAPE)
              }
              title={`Listen on ${TAPE_APP_NAME}`}
            >
              {getPublicationData(audio.metadata)?.title}
            </Link>
            <p className="line-clamp-1 md:line-clamp-2">
              {getPublicationData(audio.metadata)?.content}
            </p>
            <div className="flex w-full items-center space-x-2">
              <button
                className="bg-smoke rounded-full p-3 md:p-4"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <PauseOutline className="size-5" />
                ) : (
                  <PlayOutline className="size-5 pl-0.5" />
                )}
              </button>
              <div className="flex-1">
                <AudioPlayer
                  isPlaying={isPlaying}
                  url={getPublicationData(audio.metadata)?.asset?.uri ?? ''}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-4 top-4 md:right-6 md:top-5">
          <Link
            href={`${TAPE_WEBSITE_URL}/listen/${audio?.id}`}
            onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_LISTEN_ON_TAPE)}
            target="_blank"
            title={`Listen on ${TAPE_APP_NAME}`}
          >
            <img
              alt={TAPE_APP_NAME}
              className="ml-0.5 size-6 md:size-10"
              draggable={false}
              src={`${STATIC_ASSETS}/brand/logo.svg`}
            />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Audio
