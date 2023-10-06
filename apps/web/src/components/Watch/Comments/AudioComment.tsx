import { sanitizeDStorageUrl } from '@tape.xyz/generic'
import type { FC } from 'react'
import React from 'react'

type Props = {
  media: any
}

const AudioComment: FC<Props> = ({ media }) => {
  return (
    <div className="my-2">
      <audio controls controlsList="nodownload noplaybackrate">
        <source
          src={sanitizeDStorageUrl(media.original.url)}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
export default AudioComment
