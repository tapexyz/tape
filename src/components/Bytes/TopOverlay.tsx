import { HOME } from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import React, { FC } from 'react'
import { BsArrowLeft, BsPauseFill, BsPlayFill } from 'react-icons/bs'

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
      <div className="flex items-center justify-between">
        <div className="p-3 md:hidden">
          <Link href={HOME}>
            <a>
              <BsArrowLeft className="text-2xl text-white" />
            </a>
          </Link>
        </div>
        <div
          className={clsx('p-3', {
            'group-hover:block hidden': playing,
            block: !playing
          })}
        >
          <div>
            {playing ? (
              <BsPauseFill className="text-2xl text-white" />
            ) : (
              <BsPlayFill className="text-2xl text-white" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export default TopOverlay
