import VideoPlayer from '@lenstube/ui/VideoPlayer'
import type { FC } from 'react'
import React from 'react'

type Props = {
  thumbnailUrl: string
  playbackUrl: string
}

const LiveVideo: FC<Props> = ({ playbackUrl, thumbnailUrl }) => {
  return (
    <div>
      <div className="overflow-hidden rounded-xl">
        <VideoPlayer
          permanentUrl={playbackUrl}
          hlsUrl={playbackUrl}
          posterUrl={thumbnailUrl}
          options={{
            loadingSpinner: true,
            isCurrentlyShown: true,
            autoPlay: true
          }}
          isSensitiveContent={false}
        />
      </div>
    </div>
  )
}

export default LiveVideo
