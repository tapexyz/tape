import VideoCard from '@components/Common/VideoCard'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

const CommentedVideoCard = dynamic(
  () => import('../Library/CommentedVideoCard'),
  { loading: () => <VideoCardShimmer /> }
)
const MirroredVideoCard = dynamic(
  () => import('../Library/MirroredVideoCard'),
  { loading: () => <VideoCardShimmer /> }
)

type Props = {
  videos: LenstubePublication[]
  videoType?: 'Post' | 'Mirror' | 'Comment'
}

const Timeline: FC<Props> = ({ videos, videoType = 'Post' }) => {
  const isComment = videoType === 'Comment'
  const isMirror = videoType === 'Mirror'
  return (
    <div className="grid gap-x-5 lg:grid-cols-4 md:gap-y-8 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
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
