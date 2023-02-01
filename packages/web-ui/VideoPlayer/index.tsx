import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mux from 'mux-embed'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import {
  IPFS_GATEWAY,
  IS_MAINNET,
  LENSTUBE_WEBSITE_URL,
  MUX_DATA_KEY
} from 'utils'

import SensitiveWarning from './SensitiveWarning'

interface PlayerProps {
  playerRef?: (ref: HTMLMediaElement) => void
  permanentUrl: string
  posterUrl?: string
  children?: React.ReactNode
  ratio?: AspectRatio
  options?: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
  }
}

interface Props extends PlayerProps {
  refCallback?: (ref: HTMLMediaElement) => void
  currentTime?: number
  publicationId?: string
  isSensitiveContent?: boolean
}

const PlayerInstance: FC<PlayerProps> = ({
  ratio,
  permanentUrl,
  posterUrl,
  playerRef,
  options,
  children
}) => {
  return (
    <Player
      src={permanentUrl}
      poster={posterUrl}
      showTitle={false}
      objectFit="contain"
      aspectRatio={ratio}
      showPipButton
      mediaElementRef={playerRef}
      loop={options?.loop ?? true}
      showUploadingIndicator={false}
      muted={options?.muted ?? false}
      controls={{ defaultVolume: 1 }}
      autoPlay={options?.autoPlay ?? false}
      autoUrlUpload={
        IS_MAINNET
          ? {
              fallback: true,
              ipfsGateway: IPFS_GATEWAY
            }
          : false
      }
    >
      {children}
    </Player>
  )
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
  children
}) => {
  const router = useRouter()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    setPlayerRef(ref)
    refCallback?.(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    if (!playerRef) return
    playerRef.currentTime = Number(currentTime || 0)
    if (IS_MAINNET) {
      analyseVideo(playerRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef, currentTime])

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
          >
            {children}
          </PlayerInstance>
        </div>
      )}
    </div>
  )
}

export default React.memo(VideoPlayer)
