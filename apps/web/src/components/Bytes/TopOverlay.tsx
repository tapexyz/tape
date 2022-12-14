import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BsArrowLeft, BsPauseFill, BsPlayFill } from 'react-icons/bs'

type Props = {
  onClickPlayPause: () => void
  playing: boolean
}

const TopOverlay: FC<Props> = ({ onClickPlayPause, playing }) => {
  return (
    <div
      role="button"
      onClick={() => onClickPlayPause()}
      className="absolute top-0 z-[1] bottom-0 left-0 right-0 w-full outline-none cursor-default"
    >
      <div className="flex items-center justify-between">
        <div className="p-3 md:hidden">
          <Link href="/">
            <BsArrowLeft className="text-2xl text-white" />
          </Link>
        </div>
        <div className="p-3">
          {playing ? (
            <BsPauseFill className="text-2xl text-white" />
          ) : (
            <BsPlayFill className="text-2xl text-white" />
          )}
        </div>
      </div>
    </div>
  )
}

export default TopOverlay
