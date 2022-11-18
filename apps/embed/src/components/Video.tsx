import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import truncate from '@utils/functions/truncate'
import { Mixpanel, TRACK } from '@utils/track'
import dynamic from 'next/dynamic'
import { FC, useEffect } from 'react'
import { LenstubePublication } from 'src/types/local'

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
    Mixpanel.track(TRACK.EMBED_VIDEO_LOADED)
  }, [])

  return (
    <div className="relative w-screen h-screen">
      <MetaTags
        title={truncate(video?.metadata?.name as string, 60)}
        description={truncate(video?.metadata?.description as string, 100)}
        image={getThumbnailUrl(video)}
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
