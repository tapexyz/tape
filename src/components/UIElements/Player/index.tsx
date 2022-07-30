import usePlayerStore from '@lib/store/player'
import clsx from 'clsx'
import React, { useRef } from 'react'

import Actions from './actions'
import Video from './Video'

const LenstubePlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { playing } = usePlayerStore()

  return (
    <div className="relative group">
      <Video videoRef={videoRef} />
      <div
        className={clsx(
          'transition-all ease-in duration-150 absolute bottom-0 left-0 right-0 z-[1] h-44 rounded-b-xl bg-gradient-to-t from-black/75',
          { 'group-hover:visible invisible': playing }
        )}
      >
        <Actions videoRef={videoRef} />
      </div>
    </div>
  )
}

export default LenstubePlayer
