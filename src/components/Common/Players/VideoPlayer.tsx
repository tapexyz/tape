import 'plyr-react/dist/plyr.css'

import useAppStore from '@lib/store'
import imageCdn from '@utils/functions/imageCdn'
import { UPLOAD } from '@utils/url-path'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { APITypes, PlyrInstance, PlyrProps, usePlyr } from 'plyr-react'
import React, { FC, forwardRef, useEffect, useState } from 'react'

import PlayerContextMenu from './PlayerContextMenu'

interface Props {
  source: string
  wrapperClassName?: string
  poster: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
  time?: number
}

interface CustomPlyrProps extends PlyrProps {
  time?: number
}

export const defaultPlyrControls = [
  'play-large',
  'play',
  'progress',
  'duration',
  'mute',
  'volume',
  'captions',
  'settings',
  'pip',
  'airplay',
  'fullscreen',
  'disableContextMenu'
]

const CustomPlyrInstance = forwardRef<APITypes, CustomPlyrProps>(
  ({ source, options, time }, ref) => {
    const raptorRef = usePlyr(ref, { options, source })
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVideoLoop, setIsVideoLoop] = useState(false)
    const { pathname } = useRouter()
    const { setUploadedVideo } = useAppStore()

    useEffect(() => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr?.source === null) return
      const api = current as { plyr: PlyrInstance }

      api.plyr?.on('ready', () => {
        api.plyr.currentTime = Number(time || 0)
      })

      const onDataLoaded = () => {
        api.plyr?.off('loadeddata', onDataLoaded)
        if (pathname === UPLOAD && api.plyr?.duration) {
          setUploadedVideo({
            durationInSeconds: api.plyr?.duration.toFixed(2)
          })
        }
        api.plyr.currentTime = Number(time || 0)
      }
      // Set seek time when meta data fully downloaded
      api.plyr.on('loadedmetadata', onDataLoaded)

      return () => {
        api.plyr.pip = false
      }
    })

    const onContextClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      setShowContextMenu(false)
      const newPosition = {
        x: event.pageX,
        y: event.pageY
      }
      setPosition(newPosition)
      setShowContextMenu(true)
    }

    return (
      <div onContextMenu={onContextClick}>
        <video
          ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
          className="plyr-react plyr"
        />
        {showContextMenu && pathname === '/watch/[id]' && (
          <PlayerContextMenu
            position={position}
            ref={ref}
            hideContextMenu={() => setShowContextMenu(false)}
            isVideoLoop={isVideoLoop}
            setIsVideoLoop={setIsVideoLoop}
          />
        )}
      </div>
    )
  }
)

CustomPlyrInstance.displayName = 'CustomPlyrInstance'

const VideoPlayer: FC<Props> = ({
  source,
  controls = defaultPlyrControls,
  poster,
  autoPlay = true,
  ratio = '16:9',
  wrapperClassName,
  time
}) => {
  const ref = React.useRef<APITypes>(null)

  const options = {
    controls: controls,
    autoplay: autoPlay,
    autopause: true,
    tooltips: { controls: true, seek: true },
    ratio
  }

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      <CustomPlyrInstance
        ref={ref}
        source={{
          type: 'video',
          sources: [
            {
              src: source,
              provider: 'html5'
            }
          ],
          poster: imageCdn(poster) ?? source
        }}
        options={options}
        time={time}
      />
    </div>
  )
}

export default VideoPlayer
