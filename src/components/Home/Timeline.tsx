import CommentedVideoCard from '@components/Channel/CommentedVideoCard'
import MirroredVideoCard from '@components/Channel/MirroredVideoCard'
import VideoCard from '@components/Common/VideoCard'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

type Props = {
  videos: LenstubePublication[]
  videoType?: 'Post' | 'Mirror' | 'Comment'
}

const Timeline: FC<Props> = ({ videos, videoType = 'Post' }) => {
  const isComment = videoType === 'Comment'
  const isMirror = videoType === 'Mirror'
  return (
    <div className="grid gap-x-4 xl:grid-cols-5 md:gap-y-8 gap-y-2 ultrawide:grid-cols-6 laptop:grid-cols-4 md:grid-cols-2 grid-col-1">
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
