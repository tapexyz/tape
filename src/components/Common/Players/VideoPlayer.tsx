import useAppStore from '@lib/store'
import {
  DefaultControls,
  DefaultSettings,
  DefaultUi,
  Hls,
  Player,
  Video
} from '@vime/react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { FC, Ref, useEffect, useRef, useState } from 'react'
import { HLSData } from 'src/types/local'

import NextVideo from './NextVideo'
import PlayerContextMenu from './PlayerContextMenu'
import SensitiveWarning from './SensitiveWarning'

interface Props {
  source: string
  wrapperClassName?: string
  poster: string
  ratio?: string
  isSensitiveContent?: boolean
  hls?: HLSData
}

interface PlayerProps {
  source: string
  ratio?: string
  poster: string
  hls?: HLSData
}

const PlayerInstance = ({ source, ratio, hls, poster }: PlayerProps) => {
  const playerRef = useRef<HTMLVmPlayerElement>()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVideoLoop, setIsVideoLoop] = useState(false)
  const { pathname } = useRouter()
  const upNextVideo = useAppStore((state) => state.upNextVideo)
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const [showNext, setShowNext] = useState(false)
  const router = useRouter()
  const currentVideo = document.getElementsByTagName('video')[0]

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
    if (!playerRef.current) return
    playerRef.current.currentTime = Number(videoWatchTime || 0)
  }, [playerRef, videoWatchTime])

  useEffect(() => {
    if (!currentVideo) return
    currentVideo.onplaying = () => {
      currentVideo.style.display = 'block'
      setShowNext(false)
    }
    currentVideo.onended = () => {
      if (upNextVideo) {
        currentVideo.style.display = 'none'
        setShowNext(true)
      }
    }
    currentVideo.onloadedmetadata = () => {
      currentVideo.currentTime = Number(videoWatchTime || 0)
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

  const playNext = () => {
    router.push(`/watch/${upNextVideo?.id}`)
  }

  const cancelPlayNext = () => {
    currentVideo.style.display = 'block'
    setShowNext(false)
  }

  return (
    <div
      onContextMenu={onContextClick}
      className={clsx({
        relative: showNext
      })}
    >
      <div className="relative z-[5]">
        <Player
          tabIndex={1}
          ref={playerRef as Ref<HTMLVmPlayerElement>}
          aspectRatio={ratio}
          autopause
          autoplay
          icons="material"
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
      {showNext && (
        <NextVideo
          video={upNextVideo}
          playNext={playNext}
          cancelPlayNext={cancelPlayNext}
        />
      )}
      {showContextMenu && pathname === '/watch/[id]' && !showNext && (
        <PlayerContextMenu
          position={position}
          ref={playerRef as React.MutableRefObject<HTMLVmPlayerElement>}
          hideContextMenu={() => setShowContextMenu(false)}
          isVideoLoop={isVideoLoop}
          setIsVideoLoop={setIsVideoLoop}
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
  hls
}) => {
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  return (
    <div className={clsx('overflow-hidden rounded-xl', wrapperClassName)}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <PlayerInstance
          source={source}
          ratio={ratio}
          poster={poster}
          hls={hls}
        />
      )}
    </div>
  )
}

export default VideoPlayer
