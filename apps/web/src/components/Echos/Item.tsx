import useEchoStore from '@lib/store/echos'
import clsx from 'clsx'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BsPlay } from 'react-icons/bs'
import { FcDvdLogo } from 'react-icons/fc'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'

type Props = {
  publication: Publication
}

const Item: FC<Props> = ({ publication }) => {
  const setSelectedTrack = useEchoStore((state) => state.setSelectedTrack)

  const onPlayPause = (track: Publication) => {
    setSelectedTrack(track)
  }

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-white p-2 dark:bg-gray-900 md:w-[220px]">
      <div className="group relative flex justify-center">
        <img
          src={imageCdn(getThumbnailUrl(publication), 'square')}
          className="w-full rounded-lg object-cover transition duration-300 ease-in-out group-hover:scale-105 md:h-[220px]"
          alt={publication?.metadata?.name ?? 'cover'}
        />
        <button
          onClick={() => onPlayPause(publication)}
          className={clsx(
            'invisible absolute bottom-2.5 left-2.5 rounded-full bg-white/70 p-2 outline-none backdrop-blur-lg transition-all duration-100 ease-in-out group-hover:visible dark:bg-black/50'
          )}
        >
          {publication?.id === 'selectedTrack?.id' ? (
            <FcDvdLogo className="animate-spin-slow h-7 w-7" />
          ) : (
            <BsPlay className="h-7 w-7 pl-0.5" />
          )}
        </button>
      </div>
      <div className="mt-1">
        <Link
          href={`/channel/${publication?.profile?.handle}`}
          className="text-xs font-medium uppercase opacity-80 hover:underline hover:opacity-70"
        >
          {publication?.profile?.handle}
        </Link>
        <Link
          href={`/listen/${publication?.id}`}
          className="md:text-md line-clamp-1 text-sm font-semibold hover:opacity-70"
        >
          {publication?.metadata?.name}
        </Link>
      </div>
    </div>
  )
}

export default Item
