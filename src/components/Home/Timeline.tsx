import MirroredVideoCard from '@components/Library/MirroredVideoCard'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

const CommentedVideoCard = dynamic(
  () => import('../Library/CommentedVideoCard')
)
const VideoCard = dynamic(() => import('../Common/VideoCard'))

type Props = {
  videos: LenstubePublication[]
}

const Timeline: FC<Props> = ({ videos }) => {
  return (
    <div className="grid gap-x-5 lg:grid-cols-4 md:gap-y-8 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
      {videos?.map((video: LenstubePublication, idx: number) => {
        const isComment = video.__typename === 'Comment'
        const isMirror = video.__typename === 'Mirror'
        return isComment ? (
          <CommentedVideoCard key={`${video?.id}_${idx}`} video={video} />
        ) : isMirror ? (
          <MirroredVideoCard key={`${video?.id}_${idx}`} video={video} />
        ) : (
          <VideoCard key={`${video?.id}_${idx}`} video={video} />
        )
      })}
    </div>
  )
}

export default Timeline
