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

const Video: FC<Props> = ({ video }) => {
  const { query } = useRouter()
  const isAutoPlay = Boolean(query.autoplay) && query.autoplay === '1'
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) return
    ref.onpause = () => {
      setShowVideoOverlay(true)
    }
    ref.onplay = () => {
      setShowVideoOverlay(false)
    }
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
          options={{ autoPlay: isAutoPlay, muted: isAutoPlay, loop: true }}
        />
        {!isSensitiveContent && (
          <div
            className={`${
              showVideoOverlay ? 'block' : 'hidden'
            } group-hover:block`}
          >
            <VideoOverlay video={video} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Video
