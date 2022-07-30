import Tooltip from '@components/UIElements/Tooltip'
import React, { FC } from 'react'

import { VideoRefOnly } from '../Video'

const Pip: FC<VideoRefOnly> = ({ videoRef }) => {
  const onClick = () => {
    if (!videoRef.current) return
    videoRef.current.requestPictureInPicture()
  }

  return (
    <button onClick={onClick}>
      <Tooltip content="Miniplayer" placement="top">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="md:w-6 md:h-6"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 11h-8v6h8v-6m4 8V5c0-1.12-.9-2-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2m-2 0H3V4.97h18V19Z"
            />
          </svg>
        </span>
      </Tooltip>
    </button>
  )
}

export default Pip
