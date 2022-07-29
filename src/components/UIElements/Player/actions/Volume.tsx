import usePlayerStore from '@lib/store/player'
import { FC } from 'react'
import React from 'react'

import { VideoRefOnly } from '../Video'

const Volume: FC<VideoRefOnly> = ({ videoRef }) => {
  const { muted, setMuted } = usePlayerStore()

  const onClick = () => {
    if (!videoRef.current) return
    if (videoRef.current.muted) {
      setMuted(false)
      return (videoRef.current.muted = false)
    }
    setMuted(true)
    videoRef.current.muted = true
  }

  return (
    <button onClick={onClick}>
      {muted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="md:w-6 md:h-6"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="md:w-6 md:h-6"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 9h4l5-5v16l-5-5H3V9zm18 3a9.003 9.003 0 0 1-7 8.777V18.71a7.003 7.003 0 0 0 0-13.42V3.223c4.008.91 7 4.494 7 8.777zm-4 0a5.001 5.001 0 0 1-3 4.584V7.416c1.766.772 3 2.534 3 4.584z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}

export default Volume
