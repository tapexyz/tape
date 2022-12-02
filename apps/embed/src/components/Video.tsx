import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import type { LenstubePublication } from 'utils'
import { Analytics, TRACK } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import { getVideoUrl } from 'utils/functions/getVideoUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import truncate from 'utils/functions/truncate'

import MetaTags from './MetaTags'

type Props = {
  video: LenstubePublication
}

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false
})

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)

  useEffect(() => {
    Analytics.track(TRACK.EMBED_VIDEO.LOADED)
  }, [])

  return (
    <div className="relative w-screen h-screen">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={imageCdn(getThumbnailUrl(video), 'thumbnail')}
        videoUrl={getVideoUrl(video)}
      />
      <VideoPlayer
        source={getVideoUrl(video)}
        hls={video.hls}
        poster={sanitizeIpfsUrl(video?.metadata?.cover?.original.url)}
        isSensitiveContent={isSensitiveContent}
        videoId={video.id}
        description={video?.metadata.description}
        video={video}
      />
    </div>
  )
}

export default Video
