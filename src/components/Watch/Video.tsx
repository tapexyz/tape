import { getVideoUrl } from '@utils/functions/getVideoUrl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { SiOpenmined } from 'react-icons/si'
import { HLSData, LenstubePublication } from 'src/types/local'

const VideoPlayer = dynamic(() => import('../Common/VideoPlayer'))
const VideoActions = dynamic(() => import('./VideoActions'))

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

type PlayerProps = {
  source: string
  poster: string
  hls: HLSData
}

const MemoizedVideoPlayer = React.memo(
  ({ source, poster, hls }: PlayerProps) => (
    <VideoPlayer source={source} poster={poster} hlsSource={hls?.url} />
  )
)

MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const Video: FC<Props> = ({ video }) => {
  return (
    <div className="overflow-hidden">
      <MemoizedVideoPlayer
        source={getVideoUrl(video)}
        poster={video?.metadata?.cover?.original.url}
        hls={video.hls}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-4 text-lg font-medium line-clamp-2">
            {video.metadata.name}
          </h1>
          <div className="flex items-center text-sm opacity-70">
            <div className="flex items-center">
              <div className="flex items-center space-x-1">
                <SiOpenmined className="text-xs" />
                <span>{video.stats.totalAmountOfCollects} collects</span>
              </div>
            </div>
            <span className="middot" />
            <span title={video.createdAt}>
              uploaded {dayjs(new Date(video.createdAt)).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
