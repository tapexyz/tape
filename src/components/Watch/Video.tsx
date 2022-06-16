import ShareModal from '@components/Common/VideoCard/ShareModal'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC, useState } from 'react'
import { RiShareForwardLine } from 'react-icons/ri'
import { SiOpenmined } from 'react-icons/si'
import { LenstubePublication } from 'src/types/local'

const VideoPlayer = dynamic(() => import('../Common/VideoPlayer'))
const VideoReaction = dynamic(() => import('./VideoReaction'))

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

type PlayerProps = {
  source: string
  poster: string
}

const MemoizedVideoPlayer = React.memo(({ source, poster }: PlayerProps) => (
  <VideoPlayer source={source} poster={poster} ratio="16:9" />
))

MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const Video: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className="overflow-hidden">
      <MemoizedVideoPlayer
        source={getVideoUrl(video)}
        poster={video?.metadata?.cover?.original.url}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-4 text-lg font-medium line-clamp-2">
            {video.metadata.name}
          </h1>
          <div className="flex items-center text-sm opacity-70">
            <div className="flex items-center space-x-2">
              <Tooltip content={`Total collected`}>
                <div className="flex items-center space-x-1">
                  <SiOpenmined className="text-xs" />
                  <span>{video.stats.totalAmountOfCollects} collects</span>
                </div>
              </Tooltip>
            </div>
            <span className="middot" />
            <span title={video.createdAt}>
              uploaded {dayjs(new Date(video.createdAt)).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <VideoReaction video={video} />
        <Button
          variant="secondary"
          className="!p-0"
          onClick={() => setShowShare(true)}
        >
          <span className="flex items-center space-x-1 outline-none">
            <RiShareForwardLine />
            <span>Share</span>
          </span>
        </Button>
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
    </div>
  )
}

export default Video
