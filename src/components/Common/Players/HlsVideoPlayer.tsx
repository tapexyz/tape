import 'plyr-react/dist/plyr.css'

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
}

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

const HlsVideoPlayer: FC<Props> = ({
  controls = defaultPlyrControls,
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

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      <HlsPlayer
        ref={ref}
        source={null}
        options={options}
        hlsSource={hlsSource}
      />
    </div>
  )
}

export default HlsVideoPlayer
