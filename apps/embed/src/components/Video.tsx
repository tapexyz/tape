import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubePublication } from 'utils'
import { Analytics, TRACK } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import truncate from 'utils/functions/truncate'
import VideoPlayer from 'web-ui/VideoPlayer'

import MetaTags from './MetaTags'
import VideoOverlay from './VideoOverlay'

type Props = {
  video: LenstubePublication
}

const TopOverlay = ({ playerRef, video }: any) => {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const isSensitiveContent = getIsSensitiveContent(video?.metadata, video?.id)

  useEffect(() => {
    if (!playerRef) return
    playerRef.onpause = () => {
      setShowVideoOverlay(true)
    }
    playerRef.onplay = () => {
      setShowVideoOverlay(false)
    }
  }, [playerRef])

  return !isSensitiveContent ? (
    <div
      className={`${showVideoOverlay ? 'block' : 'hidden'} group-hover:block`}
    >
      <VideoOverlay video={video} />
    </div>
  ) : null
}

const Video: FC<Props> = ({ video }) => {
  const { query } = useRouter()
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'
  const isLoop = Boolean(query.loop) && query.loop === '1'
  const currentTime = Number(query.t) ?? 0
  const isSensitiveContent = getIsSensitiveContent(video?.metadata, video?.id)

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    setPlayerRef(ref)
  }

  return (
    <div className="relative w-screen h-screen">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={imageCdn(getThumbnailUrl(video), 'thumbnail')}
        videoUrl={getPublicationMediaUrl(video)}
      />
      <div className="relative group">
        <VideoPlayer
          refCallback={refCallback}
          permanentUrl={getPublicationMediaUrl(video)}
          isSensitiveContent={isSensitiveContent}
          posterUrl={imageCdn(
            sanitizeIpfsUrl(getThumbnailUrl(video)),
            'thumbnail'
          )}
          publicationId={video.id}
          currentTime={currentTime}
          options={{ autoPlay: isAutoPlay, muted: isAutoPlay, loop: isLoop }}
        />
        <TopOverlay
          playerRef={playerRef}
          isSensitiveContent={isSensitiveContent}
          video={video}
        />
      </div>
    </div>
  )
}

export default Video
