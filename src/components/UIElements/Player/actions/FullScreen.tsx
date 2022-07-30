import Tooltip from '@components/UIElements/Tooltip'
import React, { FC } from 'react'

import { VideoRefOnly } from '../Video'

const Fullscreen: FC<VideoRefOnly> = ({ videoRef }) => {
  const onClick = () => {
    if (!videoRef.current) return
    videoRef.current.requestFullscreen()
  }

  return (
    <button onClick={onClick}>
      <Tooltip content="Full screen" placement="top">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="md:w-7 md:h-7"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3Z"
            />
          </svg>
        </span>
      </Tooltip>
    </button>
  )
}

export default Fullscreen
