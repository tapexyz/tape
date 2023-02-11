// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mux from 'mux-embed'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IS_MAINNET, LENSTUBE_WEBSITE_URL, MUX_DATA_KEY } from 'utils'

import type { PlayerProps } from './Player'
import PlayerInstance from './Player'
import SensitiveWarning from './SensitiveWarning'

interface Props extends PlayerProps {
  refCallback?: (ref: HTMLMediaElement) => void
  currentTime?: number
  publicationId?: string
  isSensitiveContent?: boolean
}

const VideoPlayer: FC<Props> = ({
  permanentUrl,
  posterUrl,
  ratio = '16to9',
  isSensitiveContent,
  currentTime = 0,
  refCallback,
  publicationId,
  options,
  showControls = true
}) => {
  const router = useRouter()
  const playerRef = useRef<HTMLMediaElement>()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)

  const analyseVideo = (ref: HTMLMediaElement) => {
    const initTime = mux.utils.now()
    const VIDEO_TYPE = 'on-demand'
    const IS_BYTE = ratio === '9to16'
    mux.monitor(ref, {
      debug: false,
      data: {
        env_key: MUX_DATA_KEY,
        player_name: 'Lenstube Player',
        video_id: publicationId,
        video_stream_type: VIDEO_TYPE,
        player_init_time: initTime,
        video_title: IS_BYTE
          ? `${LENSTUBE_WEBSITE_URL}/bytes/${publicationId ?? router.query?.id}`
          : `${LENSTUBE_WEBSITE_URL}/watch/${
              publicationId ?? router.query?.id
            }`,
        page_type: IS_BYTE ? 'bytespage' : 'watchpage',
        video_duration: ref?.duration
      }
    })
  }

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    refCallback?.(ref)
    if (!playerRef.current) {
      return
    }
    playerRef.current = ref
    if (IS_MAINNET) {
      analyseVideo(playerRef.current)
    }
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
            ratio={ratio}
            playerRef={mediaElementRef}
            options={options}
            showControls={showControls}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
