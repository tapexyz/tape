import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

const VideoPlayer = dynamic(() => import('../Common/VideoPlayer'))

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

type PlayerProps = {
  source: string
  poster: string
}

export const MemoizedVideoPlayer = React.memo(
  ({ source, poster }: PlayerProps) => (
    <VideoPlayer source={source} poster={poster} />
  )
)

MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const Video: FC<Props> = ({ video }) => {
  return (
    <div className="overflow-hidden rounded">
      <MemoizedVideoPlayer
        source={video?.metadata?.media[1]?.original.url}
        poster={video?.metadata?.cover?.original.url}
      />
      <h1 className="mt-4 text-lg font-medium line-clamp-2">
        {video.metadata.name}
      </h1>
      <div className="flex items-center text-[11px] opacity-70">
        <span>{dayjs(new Date(video.createdAt)).fromNow()}</span>
      </div>
    </div>
  )
}

export default Video
