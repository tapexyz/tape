import 'plyr-react/dist/plyr.css'

import clsx from 'clsx'
import Plyr from 'plyr-react'
import React, { FC } from 'react'

interface Props {
  source: string
  wrapperClassName?: string
  poster?: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
}

export const defaultPlyrControls = [
  'play-large',
  'play',
  'progress',
  'current-time',
  'mute',
  'volume',
  'captions',
  'settings',
  'pip',
  'airplay',
  'fullscreen'
]

const VideoPlayer: FC<Props> = ({
  source,
  controls = defaultPlyrControls,
  poster,
  autoPlay = true,
  ratio = '16:9',
  wrapperClassName
}) => {
  const options = {
    controls: controls,
    autoplay: autoPlay,
    autopause: true,
    tooltips: { controls: true, seek: true },
    ratio
  }

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      <Plyr
        autoPlay={autoPlay}
        source={{
          type: 'video',
          sources: [
            {
              src: source,
              provider: 'html5'
            }
          ],
          poster: poster ?? source
        }}
        options={options}
      />
    </div>
  )
}

export default VideoPlayer
