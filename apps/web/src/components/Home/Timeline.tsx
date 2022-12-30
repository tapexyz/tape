import CommentedVideoCard from '@components/Channel/CommentedVideoCard'
import MirroredVideoCard from '@components/Channel/MirroredVideoCard'
import VideoCard from '@components/Common/VideoCard'
import QueuedVideo from '@components/Common/VideoCard/QueuedVideo'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'utils'

type Props = {
  videos: LenstubePublication[]
  videoType?: 'Post' | 'Mirror' | 'Comment'
}

const Timeline: FC<Props> = ({ videos, videoType = 'Post' }) => {
  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const isComment = videoType === 'Comment'
  const isMirror = videoType === 'Mirror'
  const isChannelPage =
    location.pathname === `/channel/${selectedChannel?.handle}`
  console.log('🚀 ~ isChannelPage', isChannelPage)

  return (
    <div className="grid gap-x-4 2xl:grid-cols-5 md:gap-y-8 gap-y-2 ultrawide:grid-cols-6 laptop:grid-cols-4 md:grid-cols-2 grid-col-1">
      {isChannelPage &&
        queuedVideos?.map((queuedVideo) => (
          <QueuedVideo
            key={queuedVideo?.thumbnailUrl}
            queuedVideo={queuedVideo}
          />
        ))}
      {videos?.map((video: LenstubePublication) => {
        const isPub = video.__typename === videoType && !video.collectedBy
        return isPub && isComment ? (
          <CommentedVideoCard
            key={`${video?.id}_${video.createdAt}`}
            video={video}
          />
        ) : isPub && isMirror ? (
          <MirroredVideoCard
            key={`${video?.id}_${video.createdAt}`}
            video={video}
          />
        ) : (
          isPub && (
            <VideoCard key={`${video?.id}_${video.createdAt}`} video={video} />
          )
        )
      })}
    </div>
  )
}

export default Timeline
