import usePlayerStore from '@lib/store/player'
import { FC } from 'react'
import React from 'react'

import { VideoRefOnly } from '../Video'

const PlayPause: FC<VideoRefOnly> = ({ videoRef }) => {
  const { playing, togglePlay } = usePlayerStore()

  const onClick = () => {
    togglePlay({ videoRef })
  }

  return (
    <button onClick={onClick}>
      {playing ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="md:w-6 md:h-6"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="md:w-6 md:h-6"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z" />
        </svg>
      )}
    </button>
  )
}

export default PlayPause
