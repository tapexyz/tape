import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { useAverageColor } from '@tape.xyz/browser'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  EVENTS,
  getPublicationData,
  getPublicationMediaUrl,
  getShouldUploadVideo,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl,
  Tower,
  truncate
} from '@tape.xyz/generic'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import PlayOutline from './icons/PlayOutline'
import MetaTags from './MetaTags'
import TopOverlay from './TopOverlay'

type Props = {
  video: PrimaryPublication
}

const Video: FC<Props> = ({ video }) => {
  const { query } = useRouter()
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'
  const isLoop = Boolean(query.loop) && query.loop === '1'
  const currentTime = Number(query.t ?? 0) ?? 0

  const [clicked, setClicked] = useState(isAutoPlay || currentTime !== 0)

  const isBytesVideo = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(video.metadata, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  useEffect(() => {
    Tower.track(EVENTS.EMBED_VIDEO.LOADED)
  }, [])

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return null
    }
    setPlayerRef(ref)
  }

  useEffect(() => {
    if (playerRef && clicked) {
      playerRef.autoplay = true
      playerRef?.play().catch(() => {})
    }
  }, [playerRef, clicked, isAutoPlay])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="group relative h-screen w-screen overflow-x-hidden">
      <MetaTags
        description={truncate(
          getPublicationData(video.metadata)?.content as string,
          100
        )}
        image={thumbnailUrl}
        title={truncate(
          getPublicationData(video.metadata)?.title as string,
          60
        )}
      />
      {clicked ? (
        <VideoPlayer
          currentTime={currentTime}
          options={{
            autoPlay: isAutoPlay,
            isCurrentlyShown: true,
            loadingSpinner: true,
            loop: isLoop,
            maxHeight: true,
            muted: isAutoPlay
          }}
          posterUrl={thumbnailUrl}
          refCallback={refCallback}
          shouldUpload={getShouldUploadVideo(video)}
          url={getPublicationMediaUrl(video.metadata)}
        />
      ) : (
        <div className="flex h-full w-full justify-center">
          <img
            alt="thumbnail"
            className={clsx(
              'w-full bg-gray-100 object-center dark:bg-gray-900',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            draggable={false}
            src={thumbnailUrl}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
          />
          <div
            className="absolute grid h-full w-full place-items-center"
            onClick={onClickOverlay}
            role="button"
            tabIndex={0}
          >
            <button className="bg-brand-400 rounded-full p-3 shadow-2xl xl:p-5">
              <PlayOutline className="size-6 pl-0.5 text-white" />
            </button>
          </div>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} />
    </div>
  )
}

export default Video
