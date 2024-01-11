import { getPublicationData } from '@tape.xyz/generic'
import type { PrimaryPublication } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

import PublicationOptions from '../Publication/PublicationOptions'
import ThumbnailImage from '../VideoCard/ThumbnailImage'

type Props = {
  audio: PrimaryPublication
}

const AudioCard: FC<Props> = ({ audio }) => {
  return (
    <div className="rounded-medium tape-border group relative overflow-hidden">
      <Link href={`/listen/${audio.id}`}>
        <div className="aspect-[1/1]">
          <ThumbnailImage video={audio} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black px-4 py-2">
          <h1 className="line-clamp-2 break-all font-bold text-white">
            {getPublicationData(audio.metadata)?.title}
          </h1>
        </div>
        <div
          className="absolute right-2 top-2"
          onClick={(e) => e.stopPropagation()}
        >
          <PublicationOptions publication={audio} />
        </div>
      </Link>
    </div>
  )
}

export default AudioCard
