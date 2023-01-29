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
  const currentTime = Number(query.t) ?? 0

  const [clicked, setClicked] = useState(isAutoPlay)

  const isByteVideo = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    sanitizeIpfsUrl(getThumbnailUrl(video)),
    isByteVideo ? 'thumbnail_v' : 'thumbnail'
  )

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    setPlayerRef(ref)
  }

  useEffect(() => {
    if (playerRef && clicked) {
      playerRef?.play()
    }
  }, [playerRef, clicked])

  const onClickOverlay = () => {
    setClicked(true)
  }

  return (
    <div className="relative group w-screen h-screen">
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
        <div
          className="grid place-items-center"
          onClick={onClickOverlay}
          role="button"
        >
          <img
            src={thumbnailUrl}
            className="h-full w-full"
            alt={video.metadata.name ?? video.profile.handle}
            draggable={false}
          />
          <button className="xl:p-5 p-3 rounded-full bg-indigo-500 absolute">
            <img
              className="w-5 h-5"
              src={imageCdn(
                `${STATIC_ASSETS}/images/brand/white.svg`,
                'avatar'
              )}
              alt="play"
              draggable={false}
            />
          </button>
        </div>
      )}
      <TopOverlay playerRef={playerRef} video={video} clicked={clicked} />
    </div>
  )
}

export default Video
