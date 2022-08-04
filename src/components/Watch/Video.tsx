import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import logger from '@lib/logger'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import { getPermanentVideoUrl, getVideoUrl } from '@utils/functions/getVideoUrl'
import axios from 'axios'
import dynamic from 'next/dynamic'
import React, { FC, useEffect, useState } from 'react'
import { HLSData, LenstubePublication } from 'src/types/local'

import VideoMeta from './VideoMeta'
const VideoPlayer = dynamic(() => import('../Common/Players/VideoPlayer'), {
  loading: () => <VideoCardShimmer />
})
const HlsVideoPlayer = dynamic(() => import('../Common/Players/HlsVideoPlayer'))
const VideoActions = dynamic(() => import('./VideoActions'))

type Props = {
  video: LenstubePublication
  time?: number
}

type PlayerProps = {
  source: string
  poster: string
  time?: number
  isSensitiveContent: boolean
}

const MemoizedVideoPlayer = React.memo(
  ({ source, poster, time, isSensitiveContent }: PlayerProps) => (
    <VideoPlayer
      source={source}
      poster={poster}
      time={time}
      isSensitiveContent={isSensitiveContent}
    />
  )
)
MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const MemoizedHlsVideoPlayer = React.memo(
  ({ hls, poster }: { hls: HLSData; poster: string }) => (
    <HlsVideoPlayer hlsSource={hls?.url} poster={poster} />
  )
)
MemoizedHlsVideoPlayer.displayName = 'MemoizedHlsVideoPlayer'

const Video: FC<Props> = ({ video, time }) => {
  // const isHlsSupported = Hls.isSupported()
  const [videoUrl, setVideoUrl] = useState(getVideoUrl(video))

  const checkVideoResource = async () => {
    try {
      await axios.get(videoUrl)
    } catch (error) {
      setVideoUrl(getPermanentVideoUrl(video))
      logger.error('[Error Invalid Playback]', error)
    }
  }

  useEffect(() => {
    checkVideoResource().catch((error) =>
      logger.error('[Error Invalid Playback]', error)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSensitiveContent = getIsSensitiveContent(
    video.metadata?.attributes,
    video.id
  )

  return (
    <div className="overflow-hidden">
      {/* {isHlsSupported && video.hls ? (
        <MemoizedHlsVideoPlayer
          hls={video.hls}
          poster={video?.metadata?.cover?.original.url}
        />
      ) : ( */}
      <MemoizedVideoPlayer
        source={videoUrl}
        poster={video?.metadata?.cover?.original.url}
        time={time}
        isSensitiveContent={isSensitiveContent}
      />
      {/* )} */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-4 text-lg font-medium line-clamp-2">
            {video.metadata.name}
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
