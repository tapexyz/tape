import { Analytics, TRACK } from '@lenstube/browser'
import VideoPlayer from '@lenstube/ui/VideoPlayer'
import type { FC } from 'react'
import React, { useEffect } from 'react'

type Props = {
  thumbnailUrl: string
  playbackUrl: string
}

const LiveVideo: FC<Props> = ({ playbackUrl, thumbnailUrl }) => {
  useEffect(() => {
    Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_UNLONELY)
  }, [])

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
