import React, { useRef } from 'react'

import Actions from './actions'
import Video from './Video'

const LenstubePlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className="relative">
      <Video videoRef={videoRef} />
      <Actions videoRef={videoRef} />
    </div>
  )
}

export default LenstubePlayer
