'use client'

import { tw, useAverageColor } from '@tape.xyz/browser'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  EVENTS,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl,
  Tower
} from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import { PlayOutline, VideoPlayer } from '@tape.xyz/ui'
import { useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import TopOverlay from './TopOverlay'

type Props = {
  video: PrimaryPublication
}

const Video: FC<Props> = ({ video }) => {
  const { get } = useSearchParams()

  const isAutoPlay = Boolean(get('autoplay')) && get('autoplay') === '1'
  const isLoop = Boolean(get('loop')) && get('loop') === '1'
  const currentTime = Number(get('t') ?? 0) ?? 0

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const title = getPublicationData(video.metadata)?.title || ''
  const url = getPublicationMediaUrl(video.metadata)

  const [clicked, setClicked] = useState(isAutoPlay || currentTime !== 0)
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  useEffect(() => {
    Tower.track(EVENTS.EMBED_VIDEO.LOADED)
  }, [])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="group relative h-screen w-screen overflow-x-hidden">
      {clicked ? (
        <VideoPlayer
          url={url}
          title={title}
          loop={isLoop}
          poster={thumbnailUrl}
          timestamp={currentTime}
        />
      ) : (
        <div className="flex h-full w-full justify-center">
          <img
            src={thumbnailUrl}
            className={tw(
              'w-full bg-gray-100 object-center dark:bg-gray-900',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt="thumbnail"
            draggable={false}
          />
          <div
            className="absolute grid h-full w-full place-items-center"
            tabIndex={0}
            onClick={onClickOverlay}
            role="button"
          >
            <button className="bg-brand-400 rounded-full p-3 shadow-2xl xl:p-5">
              <PlayOutline className="size-6 pl-0.5 text-white" />
            </button>
          </div>
        </div>
      )}
      <TopOverlay video={video} />
    </div>
  )
}

export default Video
