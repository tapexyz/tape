import React, { FC } from 'react'

import { VideoRefOnly } from '../Video'
import PlayPause from './PlayPause'
import UpNext from './UpNext'
import Volume from './Volume'

const Actions: FC<VideoRefOnly> = ({ videoRef }) => {
  return (
    <div className="absolute bottom-0 z-10 w-full p-2 text-white md:p-4">
      <div className="flex items-center space-x-4">
        <PlayPause videoRef={videoRef} />
        <UpNext />
        <Volume videoRef={videoRef} />
      </div>
    </div>
  )
}

export default Actions
