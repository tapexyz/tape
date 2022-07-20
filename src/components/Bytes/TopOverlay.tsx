import React, { FC } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'

type Props = {
  onClickPlayPause: () => void
  playing: boolean
}

const TopOverlay: FC<Props> = ({ onClickPlayPause, playing }) => {
  return (
    <button
      onClick={() => onClickPlayPause()}
      className="absolute top-0 left-0 right-0 w-full outline-none cursor-default pb-96 group"
    >
      <div className="hidden p-3 group-hover:block">
        <div>
          {playing ? (
            <BsPauseFill className="text-2xl text-white" />
          ) : (
            <BsPlayFill className="text-2xl text-white" />
          )}
        </div>
      </div>
    </button>
  )
}

export default TopOverlay
