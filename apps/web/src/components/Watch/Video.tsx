import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import axios from 'axios'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { LenstubePublication } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPermanentVideoUrl, getVideoUrl } from 'utils/functions/getVideoUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import logger from 'utils/logger'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('../Common/Players/VideoPlayer'), {
  loading: () => <CardShimmer />,
  ssr: false
})

type Props = {
  video: LenstubePublication
}

const Video: FC<Props> = ({ video }) => {
  const [videoUrl, setVideoUrl] = useState(getVideoUrl(video))
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)

  const checkVideoResource = async () => {
    try {
      await axios.get(videoUrl)
    } catch {
      setVideoUrl(getPermanentVideoUrl(video))
    }
  }

  useEffect(() => {
    if (!video.hls) {
      checkVideoResource().catch((error) =>
        logger.error('[Error Invalid Watch Playback]', error)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-hidden">
      <VideoPlayer
        source={videoUrl}
        hls={video.hls}
        poster={imageCdn(
          sanitizeIpfsUrl(video?.metadata?.cover?.original.url),
          'thumbnail'
        )}
        isSensitiveContent={isSensitiveContent}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-4 text-lg font-medium line-clamp-2">
            <InterweaveContent content={video.metadata?.name as string} />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
