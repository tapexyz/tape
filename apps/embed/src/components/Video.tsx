import clsx from 'clsx'
import type { Publication } from 'lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Analytics, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import truncate from 'utils/functions/truncate'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'

import MetaTags from './MetaTags'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
}

const Video: FC<Props> = ({ video }) => {
  const { query } = useRouter()
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'
  const isLoop = Boolean(query.loop) && query.loop === '1'
  const currentTime = Number(query.t ?? 0) ?? 0

  const [clicked, setClicked] = useState(isAutoPlay || currentTime !== 0)

  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeIpfsUrl(getThumbnailUrl(video)),
    isBytesVideo ? 'thumbnail_v' : 'thumbnail'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    setPlayerRef(ref)
  }

  useEffect(() => {
    if (playerRef && clicked) {
      playerRef?.play().catch(() => {})
    }
  }, [playerRef, clicked])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="group relative h-screen w-screen">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={thumbnailUrl}
        videoUrl={getPublicationMediaUrl(video)}
      />
      {clicked ? (
        <VideoPlayer
          refCallback={refCallback}
          permanentUrl={getPublicationMediaUrl(video)}
          posterUrl={thumbnailUrl}
          publicationId={video.id}
          currentTime={currentTime}
          options={{ autoPlay: isAutoPlay, muted: isAutoPlay, loop: isLoop }}
        />
      ) : (
        <div className="aspect-h-9 aspect-w-16 flex justify-center">
          <img
            src={thumbnailUrl}
            className={clsx(
              'bg-gray-100 object-center dark:bg-gray-900',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt={video.metadata.name ?? video.profile.handle}
            draggable={false}
          />
          <div
            className="absolute grid h-full w-full place-items-center"
            onClick={onClickOverlay}
            role="button"
          >
            <button className="rounded-full bg-indigo-500 p-3 xl:p-5">
              <img
                className="h-5 w-5"
                src={imageCdn(
                  `${STATIC_ASSETS}/images/brand/white.svg`,
                  'avatar'
                )}
                alt="play"
                draggable={false}
              />
            </button>
          </div>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} clicked={clicked} />
    </div>
  )
}

export default Video
