import { getPublication, isListenable } from '@dragverse/generic'
import type { AnyPublication } from '@dragverse/lens'
import type { FC } from 'react'

import Audio from './Audio'
import Video from './Video'

type Props = {
  publication: AnyPublication
}

const Publication: FC<Props> = ({ publication }) => {
  const target = getPublication(publication)
  const isAudio = isListenable(target)

  return isAudio ? <Audio audio={target} /> : <Video video={target} />
}

export default Publication
