import type { FC } from 'react'

import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import React, { memo } from 'react'

type Props = {
  playback: string
  poster: string
}

const LiveVideo: FC<Props> = ({ playback, poster }) => {
  return (
    <div className="overflow-hidden rounded-xl">
      <VideoPlayer
        isSensitiveContent={false}
        options={{
          autoPlay: true,
          isCurrentlyShown: true,
          loadingSpinner: true
        }}
        posterUrl={poster}
        url={playback}
      />
    </div>
  )
}

export default memo(LiveVideo)
