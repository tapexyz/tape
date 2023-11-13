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
import type { PrimaryPublication } from '@tape.xyz/lens'
import AudioPlayer from '@tape.xyz/ui/AudioPlayer'
import Link from 'next/link'
import type { FC } from 'react'
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
        title={truncate(
          getPublicationData(audio.metadata)?.title as string,
          60
        )}
        description={truncate(
          getPublicationData(audio.metadata)?.content as string,
          100
        )}
        image={coverImage}
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
          <div className="rounded-small aspect-[1/1] w-[150px] flex-none shadow-2xl md:w-[250px]">
            <img
              src={coverImage}
              className="rounded-small tape-border object-cover"
              alt="audio cover"
              height={500}
              width={500}
              draggable={false}
            />
          </div>
          <div className="w-full text-white md:space-y-4">
            <h1 className="line-clamp-1 text-xl font-bold leading-normal md:text-4xl">
              {getPublicationData(audio.metadata)?.title}
            </h1>
            <p className="line-clamp-1 md:line-clamp-2">
              {getPublicationData(audio.metadata)?.content}
            </p>
            <div className="flex w-full items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-smoke rounded-full p-3 md:p-4"
              >
                {isPlaying ? (
                  <PauseOutline className="h-5 w-5" />
                ) : (
                  <PlayOutline className="h-5 w-5 pl-0.5" />
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

        <div className="absolute right-6 top-5">
          <Link
            title={`Listen on ${TAPE_APP_NAME}`}
            href={`${TAPE_WEBSITE_URL}/listen/${audio?.id}`}
            target="_blank"
            onClick={() => Tower.track(EVENTS.EMBED_VIDEO.CLICK_LISTEN_ON_TAPE)}
          >
            <img
              src={`${STATIC_ASSETS}/brand/logo.svg`}
              draggable={false}
              className="ml-0.5 h-6 w-6 md:h-10 md:w-10"
              alt={TAPE_APP_NAME}
            />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Audio
