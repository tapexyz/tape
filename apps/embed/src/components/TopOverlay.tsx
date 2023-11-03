import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import VideoOverlay from './VideoOverlay'

type OverlayProps = {
  playerRef: HTMLMediaElement | undefined
  video: PrimaryPublication
}

const TopOverlay: FC<OverlayProps> = ({ playerRef, video }) => {
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)

  useEffect(() => {
    if (playerRef) {
      playerRef.onpause = () => {
        setShowVideoOverlay(true)
      }
      playerRef.onplay = () => {
        setShowVideoOverlay(false)
      }
    }
  }, [playerRef])

  return (
    <div
      className={`${
        showVideoOverlay ? 'visible' : 'invisible'
      } transition-all duration-200 ease-in-out group-hover:visible`}
    >
      <VideoOverlay video={video} />
    </div>
  )
}

export default TopOverlay
