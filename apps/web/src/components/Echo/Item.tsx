import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BsPlay } from 'react-icons/bs'
import { FcDvdLogo } from 'react-icons/fc'
import type { LenstubePublication } from 'utils'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'

type Props = {
  publication: LenstubePublication
}

const Item: FC<Props> = ({ publication }) => {
  // const onPlayPause = (publication: LenstubePublication) => {
  //   setSelectedTrack(publication)
  // }

  return (
    <div className="flex flex-col p-2 bg-white rounded-xl h-full w-[220px] dark:bg-gray-900">
      <div className="relative flex justify-center group">
        <img
          src={imageCdn(getThumbnailUrl(publication), 'square')}
          className="h-48 w-full group-hover:scale-105 object-cover rounded-lg duration-300 ease-in-out transition"
          alt={publication?.metadata?.name ?? 'cover'}
        />
        <button
          // onClick={() => onPlayPause(publication)}
          className={clsx(
            'absolute p-2 duration-100 ease-in-out rounded-full outline-none transition-all group-hover:visible bottom-2.5 left-2.5 bg-white/70 dark:bg-black/50 backdrop-blur-lg',
            {
              // invisible: publication?.id !== selectedTrack?.id
            }
          )}
        >
          {publication?.id === 'selectedTrack?.id' ? (
            <FcDvdLogo className="w-7 h-7 animate-spin-slow" />
          ) : (
            <BsPlay className="w-7 h-7 pl-0.5" />
          )}
        </button>
      </div>
      <div className="mt-1">
        <Link href={publication?.profile?.handle ?? '/'}>
          <span className="text-xs font-medium hover:underline opacity-80 hover:opacity-70 uppercase">
            {publication?.profile?.handle}
          </span>
        </Link>
        <Link href={`/listen/${publication?.id}`}>
          <h1 className="text-md font-semibold line-clamp-2 hover:opacity-70">
            {publication?.metadata?.name}
          </h1>
        </Link>
      </div>
    </div>
  )
}

export default Item
