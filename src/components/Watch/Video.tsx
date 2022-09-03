import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import imageCdn from '@utils/functions/imageCdn'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import dynamic from 'next/dynamic'
import React, { FC, useState } from 'react'
import { LenstubePublication } from 'src/types/local'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('../Common/Players/VideoPlayer'), {
  loading: () => <CardShimmer />
})

type Props = {
  video: LenstubePublication
}

const Video: FC<Props> = ({ video }) => {
  // const [videoUrl, setVideoUrl] = useState(getVideoUrl(video))
  const [videoUrl] = useState(getVideoUrl(video))
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)

  // const checkVideoResource = async () => {
  //   try {
  //     await axios.get(videoUrl)
  //   } catch (error) {
  //     setVideoUrl(getPermanentVideoUrl(video))
  //     logger.error('[Error Invalid Watch Playback]', error)
  //   }
  // }

  // useEffect(() => {
  //   if (!video.hls) {
  //     checkVideoResource().catch((error) =>
  //       logger.error('[Error Invalid Watch Playback]', error)
  //     )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
            {video.metadata?.name}
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
