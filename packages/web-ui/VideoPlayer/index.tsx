import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { PlayerProps } from './Player'
import PlayerInstance from './Player'
import SensitiveWarning from './SensitiveWarning'

interface Props extends PlayerProps {
  refCallback?: (ref: HTMLMediaElement) => void
  currentTime?: number
  publicationId?: string
  isSensitiveContent?: boolean
  hlsUrl: string
  isLivestream: 'true' | 'false'
  livestreamPlaybackId?: string
}

const VideoPlayer: React.FC<Props> = ({
  permanentUrl,
  hlsUrl,
  posterUrl,
  ratio = '16to9',
  isSensitiveContent,
  currentTime = 0,
  refCallback,
  publicationId,
  options,
  showControls = true,
  isLivestream = 'false',
  livestreamPlaybackId
}) => {
  const playerRef = useRef<HTMLMediaElement>()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    refCallback?.(ref)
    playerRef.current = ref
    playerRef.current.currentTime = Number(currentTime || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    playerRef.current.currentTime = Number(currentTime || 0)
  }, [currentTime])

  const onContextClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="w-full">
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div onContextMenu={onContextClick} className="relative">
          <PlayerInstance
            posterUrl={posterUrl}
            permanentUrl={permanentUrl}
            hlsUrl={hlsUrl}
            ratio={ratio}
            playerRef={mediaElementRef}
            options={options}
            showControls={showControls}
            isLivestream={isLivestream}
            livestreamPlaybackId={livestreamPlaybackId}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
