import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IPFS_GATEWAY, LENSTUBE_WEBSITE_URL } from 'utils'
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
}

interface PlayerProps {
  permanentUrl: string
  posterUrl: string
  ratio?: AspectRatio
  playerRef: (ref: HTMLMediaElement) => void
}

const PlayerInstance = ({
  permanentUrl,
  posterUrl,
  ratio,
  playerRef
}: PlayerProps) => {
  return (
    <Player
      mediaElementRef={playerRef}
      poster={posterUrl}
      src={permanentUrl}
      aspectRatio={ratio}
      autoUrlUpload={{
        fallback: true,
        ipfsGateway: IPFS_GATEWAY
      }}
      loop={true}
      showPipButton={true}
      autoPlay={false}
      muted={false}
      showTitle={false}
    />
  )
}

const VideoPlayer: FC<Props> = ({
  permanentUrl,
  posterUrl,
  ratio = '16to9',
  isSensitiveContent,
  currentTime = 0,
  refCallback,
  publicationId
}) => {
  const [copy] = useCopyToClipboard()
  const router = useRouter()
  const [sensitiveWarning, setSensitiveWarning] = useState(isSensitiveContent)
  const [playerRef, setPlayerRef] = useState<HTMLMediaElement>()

  const mediaElementRef = useCallback((ref: HTMLMediaElement) => {
    setPlayerRef(ref)
    refCallback?.(ref)
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
          <div className="relative z-[5]">
            <PlayerInstance
              posterUrl={posterUrl}
              permanentUrl={permanentUrl}
              ratio={ratio}
              playerRef={mediaElementRef}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
