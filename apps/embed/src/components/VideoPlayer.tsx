import {
  DefaultControls,
  DefaultSettings,
  DefaultUi,
  Hls,
  Player,
  Video
} from '@vime/react'
import clsx from 'clsx'
import type { FC, Ref } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import type { HLSData, LenstubePublication } from 'src/types/local'

import PlayerContextMenu from './PlayerContextMenu'
import SensitiveWarning from './SensitiveWarning'
import VideoOverlay from './VideoOverlay'

interface Props {
  source: string
  wrapperClassName?: string
  poster: string
  ratio?: string
  isSensitiveContent?: boolean
  hls?: HLSData
  videoId?: string
  description?: string
  video: LenstubePublication
}

interface PlayerProps {
  source: string
  ratio?: string
  poster: string
  hls?: HLSData
  videoId?: string
  description?: string
  video: LenstubePublication
}

const PlayerInstance = ({ source, ratio, hls, poster, video }: PlayerProps) => {
  const playerRef = useRef<HTMLVmPlayerElement>()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [showVideoOverlay, setShowVideoOverlay] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVideoLoop, setIsVideoLoop] = useState(false)

  let currentVideo: HTMLVideoElement | null = null
  if (typeof window !== 'undefined') {
    currentVideo = document.getElementsByTagName('video')[0]
  }

  const handleKeyboardShortcuts = () => {
    if (!playerRef.current) return
    playerRef.current.focus()

    // prevent default actions
    playerRef.current.addEventListener('keydown', (e) => {
      e.preventDefault()
    })

    playerRef.current.onfullscreenchange = () => {
      if (playerRef.current) playerRef.current.focus()
    }

    // Enable keyboard shortcuts in fullscreen
    document.addEventListener('keydown', (e) => {
      if (
        playerRef.current &&
        playerRef.current.isFullscreenActive &&
        e.target !== playerRef.current
      ) {
        // Create a new keyboard event
        const keyboardEvent = new KeyboardEvent('keydown', {
          key: e.key,
          code: e.code,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey
        })

        // dispatch it to the videoplayer
        playerRef.current.dispatchEvent(keyboardEvent)
      }
    })
  }

  useEffect(() => {
    if (!currentVideo) return

    currentVideo.onpause = () => {
      setShowVideoOverlay(true)
    }

    currentVideo.onplay = () => {
      setShowVideoOverlay(false)
    }

    if (playerRef.current) handleKeyboardShortcuts()
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
    <div onContextMenu={onContextClick} className="relative group">
      <div className="relative z-[5]">
        <Player
          tabIndex={1}
          ref={playerRef as Ref<HTMLVmPlayerElement>}
          aspectRatio={ratio}
          autopause
          autoplay
          icons="material"
          onVmPlay={() => {
            setShowVideoOverlay(false)
          }}
          onVmPlaybackEnded={() => setShowVideoOverlay(true)}
        >
          {hls?.url ? (
            <Hls version="latest" poster={poster}>
              <source data-src={hls.url} type={hls.type} />
            </Hls>
          ) : (
            <Video
              preload="metadata"
              crossOrigin="anonymous"
              autoPiP
              poster={poster}
            >
              <source data-src={source} type="video/mp4" />
            </Video>
          )}

          <DefaultUi noControls>
            <DefaultControls hideOnMouseLeave activeDuration={2000} />
            <DefaultSettings />
          </DefaultUi>
        </Player>
      </div>
      <div
        className={`${showVideoOverlay ? 'block' : 'hidden'} group-hover:block`}
      >
        <VideoOverlay video={video} />
      </div>
      {showContextMenu && (
        <PlayerContextMenu
          position={position}
          ref={playerRef as React.MutableRefObject<HTMLVmPlayerElement>}
          hideContextMenu={() => setShowContextMenu(false)}
          isVideoLoop={isVideoLoop}
          setIsVideoLoop={setIsVideoLoop}
          videoId={video?.id}
        />
      )}
    </div>
  )
}

const VideoPlayer: FC<Props> = ({
  source,
  poster,
  ratio = '16:9',
  wrapperClassName,
  isSensitiveContent,
  hls,
  video
}) => {
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  return (
    <div className={clsx('overflow-hidden', wrapperClassName)}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <PlayerInstance
          source={source}
          ratio={ratio}
          poster={poster}
          hls={hls}
          video={video}
        />
      )}
    </div>
  )
}

export default VideoPlayer
