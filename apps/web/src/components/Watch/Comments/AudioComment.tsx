import { sanitizeDStorageUrl } from '@tape.xyz/generic'
import type { FC } from 'react'
import React from 'react'

type Props = {
  uri: string
}

const AudioComment: FC<Props> = ({ uri }) => {
  return (
    <div className="my-2">
      <audio controls controlsList="nodownload noplaybackrate">
        <source src={sanitizeDStorageUrl(uri)} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
export default AudioComment
