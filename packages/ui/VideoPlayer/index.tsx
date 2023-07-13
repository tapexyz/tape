import type { FC } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { PlayerProps } from './Player'
import PlayerInstance from './Player'
import SensitiveWarning from './SensitiveWarning'

interface Props extends PlayerProps {
  hlsUrl: string
  currentTime?: number
  isSensitiveContent?: boolean
  refCallback?: (ref: HTMLMediaElement) => void
}

const VideoPlayer: FC<Props> = ({
  hlsUrl,
  address,
  options,
  posterUrl,
  refCallback,
  permanentUrl,
  ratio = '16to9',
  currentTime = 0,
  isSensitiveContent,
  showControls = true
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
    <div className={`w-full ${options.maxHeight && 'h-full'}`}>
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div
          onContextMenu={onContextClick}
          className={`relative ${options.maxHeight && 'h-full'}`}
        >
          <PlayerInstance
            ratio={ratio}
            hlsUrl={hlsUrl}
            options={options}
            address={address}
            posterUrl={posterUrl}
            playerRef={mediaElementRef}
            permanentUrl={permanentUrl}
            showControls={showControls}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
