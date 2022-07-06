import 'plyr/dist/plyr.css'

import imageCdn from '@utils/functions/imageCdn'
import clsx from 'clsx'
import { APITypes, PlyrInstance, PlyrProps, usePlyr } from 'plyr-react'
import React, { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiCheck } from 'react-icons/bi'
import { ImLoop2 } from 'react-icons/im'
import { IoMdLink } from 'react-icons/io'

interface Props {
  source: string
  wrapperClassName?: string
  poster: string
  controls?: string[]
  autoPlay?: boolean
  ratio?: string
  time?: number
}

interface customPlyrProps extends PlyrProps {
  time?: number
}

interface Event {
  key: string
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
  'fullscreen',
  'disableContextMenu'
]

const CustomPlyrInstance = React.forwardRef<APITypes, customPlyrProps>(
  ({ source, options, time }, ref) => {
    const raptorRef = usePlyr(ref, { options, source })
    const [isShown, setIsShown] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [loop, setIsLoop] = useState(false)

    React.useEffect(() => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr.source === null) return
      const api = current as { plyr: PlyrInstance }

      api.plyr.on('ready', () => {
        api.plyr.currentTime = Number(time || 0)
      })

      const onDataLoaded = () => {
        api.plyr.off('loadeddata', onDataLoaded)
        api.plyr.currentTime = Number(time || 0)
      }
      //Set seek time when meta data fully downloaded
      // api.plyr.on('loadeddata', onDataLoaded)
      api.plyr.on('loadedmetadata', onDataLoaded)
    })

    const escFunction = useCallback((event: Event) => {
      if (event.key === 'Escape') {
        setIsShown(false)
      }
    }, [])

    useEffect(() => {
      document.addEventListener('keydown', escFunction)
      return () => {
        document.removeEventListener('keydown', escFunction, false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClick = () => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr.source === null) return
      const api = current as { plyr: PlyrInstance }
      const url = new URL(window.location.href)
      url.searchParams.set('t', api.plyr.currentTime.toFixed(2).toString())
      navigator.clipboard.writeText(url.href)
      toast.success('Link copied to clipboard')
    }

    const toggleLoop = () => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr.source === null) return
      const api = current as { plyr: PlyrInstance }
      api.plyr.loop = !api.plyr.loop
      setIsLoop(api.plyr.loop)
    }

    const onCopyVideoUrl = () => {
      navigator.clipboard.writeText(window.location.href.split('?')[0])
      toast.success('Link copied to clipboard')
    }

    const showContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsShown(false)
      const newPosition = {
        x: event.pageX,
        y: event.pageY
      }

      setPosition(newPosition)
      setIsShown(true)
    }

    const hideContextMenu = () => {
      setIsShown(false)
    }

    return (
      <>
        <div onContextMenu={showContextMenu} onClick={hideContextMenu}>
          <video
            ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
            className="plyr-react plyr"
          />
          {isShown && (
            <div
              style={{ top: position.y, left: position.x }}
              className={`custom-context-menu fixed z-10 bg-gray-900 bg-opacity-75 rounded-lg px-3 py-3 text-white top-${`[${position.y}px]`} left-${`[${position.x}px]`}`}
            >
              <div
                className="cursor-pointer hover:bg-gray-500 px-3 py-2 hover:rounded-lg"
                onClick={toggleLoop}
              >
                <div className="flex justify-between">
                  <div className="flex space-x-2 items-center">
                    <ImLoop2 className="h-4 w-4" />
                    <p>Loop</p>
                  </div>
                  {loop && <BiCheck className="h-6 w-6" />}
                </div>
              </div>
              <div
                className="cursor-pointer hover:bg-gray-500 px-3 py-2 hover:rounded-lg"
                onClick={onCopyVideoUrl}
              >
                <div className="flex space-x-2 items-center">
                  <IoMdLink className="h-6 w-6" />
                  <p>Copy video URL</p>
                </div>
              </div>
              <div
                className="cursor-pointer hover:bg-gray-500 px-3 py-2 hover:rounded-lg"
                onClick={handleClick}
              >
                <div className="flex space-x-2 items-center">
                  <IoMdLink className="h-6 w-6" />
                  <p>Copy video URL at current time</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
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
    <div
      className={clsx('wrapper overflow-hidden rounded-xl', wrapperClassName)}
    >
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
