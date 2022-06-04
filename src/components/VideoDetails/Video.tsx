import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'
const VideoPlayer = dynamic(() => import('../Common/VideoPlayer'))

type Props = {
  video: LenstubePublication
}

const Video: FC<Props> = ({ video }) => {
  return (
    <div className="overflow-hidden rounded">
      <VideoPlayer
        source={video?.metadata?.media[0]?.original.url}
        poster={video?.metadata?.cover?.original.url}
      />
      <h1 className="mt-4 text-lg font-medium line-clamp-2">
        {video.metadata.name}
      </h1>
    </div>
  )
}

export default Video
