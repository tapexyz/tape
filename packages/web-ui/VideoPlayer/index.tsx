import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IPFS_GATEWAY, IS_MAINNET, LENSTUBE_WEBSITE_URL } from 'utils'
import { videoPlayerTheme } from 'utils/functions/livepeer'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'

import SensitiveWarning from './SensitiveWarning'

interface Props {
  permanentUrl: string
  posterUrl: string
  isSensitiveContent?: boolean
  ratio?: AspectRatio
  currentTime?: number
  refCallback?: (ref: HTMLMediaElement) => void
  publicationId?: string
  options?: {
    autoPlay: boolean
    loop: boolean
    muted: boolean
  }
  children?: React.ReactNode
}

interface PlayerProps {
  permanentUrl: string
  posterUrl: string
  children: React.ReactNode
  ratio?: AspectRatio
  playerRef: (ref: HTMLMediaElement) => void
  options?: {
    autoPlay: boolean
    muted: boolean
    loop: boolean
  }
}

const PlayerInstance = ({
  permanentUrl,
  posterUrl,
  ratio,
  playerRef,
  options,
  children
}: PlayerProps) => {
  return (
    <Player
      theme={videoPlayerTheme}
      mediaElementRef={playerRef}
      poster={posterUrl}
      src={permanentUrl}
      aspectRatio={ratio}
      autoUrlUpload={
        IS_MAINNET
          ? {
              fallback: true,
              ipfsGateway: IPFS_GATEWAY
            }
          : false
      }
      objectFit="contain"
      showPipButton={true}
      autoPlay={options?.autoPlay ?? false}
      muted={options?.muted ?? false}
      loop={options?.loop ?? true}
      showTitle={false}
      showUploadingIndicator={false}
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
  const [copy] = useCopyToClipboard()
  const router = useRouter()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    setPlayerRef(ref)
    refCallback?.(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!playerRef) return
    playerRef.currentTime = Number(currentTime || 0)
  }, [playerRef, currentTime])

  const onContextClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    await copy(
      `${LENSTUBE_WEBSITE_URL}/watch/${publicationId ?? router.query?.id}`
    )
    toast.success('Video link copied')
  }

  return (
    <div className="overflow-hidden md:rounded-xl">
      {sensitiveWarning ? (
        <SensitiveWarning acceptWarning={() => setSensitiveWarning(false)} />
      ) : (
        <div onContextMenu={onContextClick}>
          <div className="relative">
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
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
