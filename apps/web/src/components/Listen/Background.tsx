import type { PrimaryPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { useAverageColor } from '@tape.xyz/browser'
import {
  getThumbnailUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import React from 'react'

type Props = {
  audio: PrimaryPublication
  children: React.ReactNode
}

const Background: FC<Props> = ({ audio, children }) => {
  const coverUrl = imageCdn(
    sanitizeDStorageUrl(getThumbnailUrl(audio.metadata, true)),
    'SQUARE'
  )
  const { color: backgroundColor } = useAverageColor(coverUrl, true)

  return (
    <div className="relative h-1/4 overflow-hidden" style={{ backgroundColor }}>
      <img
        alt="audio cover"
        className="absolute inset-0 w-full object-center"
        draggable={false}
        src={coverUrl}
      />
      <div className="absolute inset-0 h-full w-full bg-black bg-opacity-40" />
      <div className="backdrop-blur-3xl">{children}</div>
    </div>
  )
}

export default Background
