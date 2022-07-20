import 'plyr-react/plyr.css'

import imageCdn from '@utils/functions/imageCdn'
import useHls from '@utils/hooks/useHLS'
import clsx from 'clsx'
import { APITypes, PlyrProps, usePlyr } from 'plyr-react'
import React, { FC, forwardRef, useRef } from 'react'

import { defaultPlyrControls } from './VideoPlayer'

interface Props {
  wrapperClassName?: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
  hlsSource: string
  poster: string
}

const HlsPlayer = forwardRef<
  APITypes,
  PlyrProps & { hlsSource: string; poster: string }
>((props, ref) => {
  const { source, options = null, hlsSource, poster } = props
  const raptorRef = usePlyr(ref, {
    ...useHls(hlsSource, options),
    source
  }) as React.MutableRefObject<HTMLVideoElement>
  return (
    <video
      poster={imageCdn(poster, 'thumbnail')}
      autoPlay
      ref={raptorRef}
      className="plyr-react plyr"
    />
  )
})
HlsPlayer.displayName = 'CustomHlsPlyr'

const HlsVideoPlayer: FC<Props> = ({
  controls = defaultPlyrControls,
  autoPlay = true,
  ratio = '16:9',
  wrapperClassName,
  hlsSource,
  poster
}) => {
  const options = {
    controls: controls,
    autoplay: autoPlay,
    autopause: true,
    tooltips: { controls: true, seek: true },
    ratio
  }
  const ref = useRef<APITypes>(null)

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      <HlsPlayer
        ref={ref}
        poster={poster}
        source={null}
        options={options}
        hlsSource={hlsSource}
      />
    </div>
  )
}

export default HlsVideoPlayer
