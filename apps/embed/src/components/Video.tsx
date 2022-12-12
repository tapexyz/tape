import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubePublication } from 'utils'
import { Analytics, TRACK } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import { getVideoUrl } from 'utils/functions/getVideoUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import truncate from 'utils/functions/truncate'

import MetaTags from './MetaTags'
import SensitiveWarning from './SensitiveWarning'
import VideoOverlay from './VideoOverlay'

type Props = {
  video: LenstubePublication
}

const VideoPlayer = dynamic(() => import('web-ui/VideoPlayer'), {
  ssr: false
})

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

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
        videoUrl={getVideoUrl(video)}
      />
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div className="relative group">
          <VideoPlayer
            refCallback={refCallback}
            permanentUrl={getVideoUrl(video)}
            isSensitiveContent={isSensitiveContent}
            posterUrl={imageCdn(
              sanitizeIpfsUrl(getThumbnailUrl(video)),
              'thumbnail'
            )}
            publicationId={video.id}
            options={{ autoPlay: true, muted: true }}
          />
          <div
            className={`${
              showVideoOverlay ? 'block' : 'hidden'
            } group-hover:block`}
          >
            <VideoOverlay video={video} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Video
