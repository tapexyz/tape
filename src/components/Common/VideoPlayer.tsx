import 'plyr-react/dist/plyr.css'

import useHls from '@utils/hooks/useHLS'
import clsx from 'clsx'
import Hls from 'hls.js'
import Plyr, { APITypes, PlyrProps, usePlyr } from 'plyr-react'
import React, { FC, forwardRef, useRef } from 'react'

interface Props {
  source: string
  wrapperClassName?: string
  poster?: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
  hlsSource?: string
}

const defaultControls = [
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
const HlsPlayer = forwardRef<APITypes, PlyrProps & { hlsSource: string }>(
  (props, ref) => {
    const { source, options = null, hlsSource } = props
    const raptorRef = usePlyr(ref, {
      ...useHls(hlsSource, options),
      source
    }) as React.MutableRefObject<HTMLVideoElement>
    return <video ref={raptorRef} className="plyr-react plyr" />
  }
)
HlsPlayer.displayName = 'CustomHlsPlyr'

const VideoPlayer: FC<Props> = ({
  source,
  controls = defaultControls,
  poster,
  autoPlay = true,
  ratio = '16:9',
  wrapperClassName,
  hlsSource
}) => {
  const options = {
    controls: controls,
    autoplay: autoPlay,
    autopause: true,
    tooltips: { controls: true, seek: true },
    ratio
  }
  const ref = useRef<APITypes>(null)
  const supported = Hls.isSupported()

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      {supported && hlsSource ? (
        <HlsPlayer
          ref={ref}
          source={null}
          options={options}
          hlsSource={hlsSource}
        />
      ) : (
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
      )}
    </div>
  )
}

export default VideoPlayer
