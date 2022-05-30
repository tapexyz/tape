import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'
const VideoPlayer = dynamic(() => import('../common/VideoPlayer'))

type Props = {
  video: LenstubePublication
}

const Video: FC<Props> = ({ video }) => {
  return (
    <div className="overflow-hidden rounded">
      <VideoPlayer
        source={video?.metadata?.content}
        poster={video?.metadata?.cover?.original.url}
      />
    </div>
  )
}

export default Video
