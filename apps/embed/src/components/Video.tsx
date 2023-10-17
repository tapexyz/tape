import { useAverageColor } from '@tape.xyz/browser'
import { LENSTUBE_BYTES_APP_ID } from '@tape.xyz/constants'
import {
  getPublicationMediaUrl,
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl,
  truncate
} from '@tape.xyz/generic'
import type { MirrorablePublication } from '@tape.xyz/lens'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import MetaTags from './MetaTags'
import PlayOutline from './PlayOutline'
import TopOverlay from './TopOverlay'

type Props = {
  video: MirrorablePublication
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
    sanitizeDStorageUrl(getThumbnailUrl(video, true)),
    isBytesVideo ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

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
        title={truncate(video?.metadata?.marketplace?.name as string, 60)}
        description={truncate(
          video?.metadata?.marketplace?.description as string,
          100
        )}
        image={thumbnailUrl}
        videoUrl={getPublicationMediaUrl(video.metadata)}
      />
      {clicked ? (
        <VideoPlayer
          refCallback={refCallback}
          url={getPublicationMediaUrl(video.metadata)}
          posterUrl={thumbnailUrl}
          currentTime={currentTime}
          options={{
            autoPlay: isAutoPlay,
            muted: isAutoPlay,
            loop: isLoop,
            loadingSpinner: true,
            isCurrentlyShown: true,
            maxHeight: true
          }}
        />
      ) : (
        <div className="flex h-full w-full justify-center">
          <img
            src={thumbnailUrl}
            className={clsx(
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
            <button className="from-brand-300 to-brand-600 rounded-full bg-gradient-to-r p-2 shadow-2xl xl:p-5">
              <PlayOutline className="h-6 w-6 pl-0.5 text-white" />
            </button>
          </div>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} />
    </div>
  )
}

export default Video
