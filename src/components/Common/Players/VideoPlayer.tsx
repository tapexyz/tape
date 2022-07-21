import 'plyr-react/plyr.css'

import useAppStore from '@lib/store'
import * as tf from '@tensorflow/tfjs'
import { IS_MAINNET } from '@utils/constants'
import { getIsNSFW } from '@utils/functions/getIsNSFW'
import imageCdn from '@utils/functions/imageCdn'
import { UPLOAD } from '@utils/url-path'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import * as nsfwjs from 'nsfwjs'
import { APITypes, PlyrInstance, PlyrProps, usePlyr } from 'plyr-react'
import React, { FC, forwardRef, useEffect, useState } from 'react'

if (IS_MAINNET) {
  tf.enableProdMode()
}

import PlayerContextMenu from './PlayerContextMenu'
import SensitiveWarning from './SensitiveWarning'

interface Props {
  source: string
  wrapperClassName?: string
  poster: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
  time?: number
  isSensitiveContent?: boolean
}

interface CustomPlyrProps extends PlyrProps {
  time?: number
  onVideoDataLoaded: () => void
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
  ({ source, options, time, onVideoDataLoaded }, ref) => {
    const raptorRef = usePlyr(ref, { options, source })
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVideoLoop, setIsVideoLoop] = useState(false)
    const { pathname } = useRouter()
    const { setUploadedVideo, uploadedVideo } = useAppStore()

    const analyseVideo = async (currentVideo: HTMLVideoElement) => {
      if (currentVideo && !uploadedVideo.isNSFW) {
        const model = await nsfwjs.load()
        const predictions = await model?.classify(currentVideo, 3)
        setUploadedVideo({
          isNSFW: getIsNSFW(predictions)
        })
      }
    }

    const onDataLoaded = (event: Event) => {
      if (event.target) {
        onVideoDataLoaded()
        if (pathname === UPLOAD) {
          const currentVideo = document.getElementsByTagName('video')[0]
          analyseVideo(currentVideo)
        }
      }
    }

    useEffect(() => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr?.source === null) return
      const api = current as { plyr: PlyrInstance }

      api.plyr?.on('ready', () => {
        api.plyr.currentTime = Number(time || 0)
      })

      const metaDataLoaded = () => {
        if (pathname === UPLOAD && api.plyr?.duration) {
          setUploadedVideo({
            durationInSeconds: api.plyr.duration.toFixed(2)
          })
        }
        api.plyr.currentTime = Number(time || 0)
      }
      // Set seek time when meta data fully loaded
      api.plyr.on('loadedmetadata', metaDataLoaded)

      // fired when the frame at the current playback
      const currentVideo = document.getElementsByTagName('video')[0]
      currentVideo.onloadeddata = (e) => onDataLoaded(e)

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
          preload={pathname === UPLOAD ? 'auto' : 'metadata'}
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
  time,
  isSensitiveContent
}) => {
  const ref = React.useRef<APITypes>(null)
  const [plyrControls, setPlyrControls] = useState<string[]>(['progress'])
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  const options = {
    controls: plyrControls,
    autoplay: autoPlay,
    autopause: true,
    tooltips: { controls: true, seek: true },
    ratio
  }

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
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
            poster: imageCdn(poster, 'thumbnail') ?? source
          }}
          options={options}
          time={time}
          onVideoDataLoaded={() => setPlyrControls(controls)}
        />
      )}
    </div>
  )
}

export default VideoPlayer
