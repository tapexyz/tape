import type { FC } from 'react'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { PlayerProps } from './Player'

import PlayerInstance from './Player'
import SensitiveWarning from './SensitiveWarning'

interface Props extends PlayerProps {
  currentTime?: number
  isSensitiveContent?: boolean
  refCallback?: (ref: HTMLMediaElement) => void
  url: string
}

const VideoPlayer: FC<Props> = ({
  address,
  currentTime = 0,
  isSensitiveContent,
  options,
  posterUrl,
  ratio = '16to9',
  refCallback,
  shouldUpload,
  showControls = true,
  url
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
          className={`relative flex ${options.maxHeight && 'h-full'}`}
          onContextMenu={onContextClick}
        >
          <PlayerInstance
            address={address}
            options={options}
            playerRef={mediaElementRef}
            posterUrl={posterUrl}
            ratio={ratio}
            shouldUpload={shouldUpload}
            showControls={showControls}
            url={url}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
