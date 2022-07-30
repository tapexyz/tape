import React, { FC } from 'react'

import { VideoRefOnly } from '../Video'
import AutoPlay from './AutoPlay'
import Duration from './Duration'
import Fullscreen from './FullScreen'
import Pip from './Pip'
import PlayPause from './PlayPause'
import UpNext from './UpNext'
import Volume from './Volume'

const Actions: FC<VideoRefOnly> = ({ videoRef }) => {
  return (
    <div className="absolute bottom-0 w-full p-2 text-white md:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PlayPause videoRef={videoRef} />
          <UpNext />
          <Volume videoRef={videoRef} />
          <Duration videoRef={videoRef} />
        </div>
        <div className="flex items-center space-x-4">
          <AutoPlay />
          <Pip videoRef={videoRef} />
          <Fullscreen videoRef={videoRef} />
        </div>
      </div>
    </div>
  )
}

export default Actions
