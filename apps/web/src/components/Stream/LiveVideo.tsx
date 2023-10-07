import { Analytics, TRACK } from '@tape.xyz/browser'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
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
    <div className="overflow-hidden rounded-xl">
      <VideoPlayer
        url={playbackUrl}
        posterUrl={thumbnailUrl}
        options={{
          loadingSpinner: true,
          isCurrentlyShown: true,
          autoPlay: true
        }}
        isSensitiveContent={false}
      />
    </div>
  )
}

export default LiveVideo
