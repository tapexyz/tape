import type { MediaSet } from '@lenstube/lens'
import type { FC } from 'react'
import React from 'react'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'

type Props = {
  media: MediaSet
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
