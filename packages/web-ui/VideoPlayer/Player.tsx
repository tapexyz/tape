import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
import type { FC } from 'react'
import React from 'react'
import { IPFS_GATEWAY } from 'utils'

export interface PlayerProps {
  playerRef?: (ref: HTMLMediaElement) => void
  permanentUrl: string
  posterUrl?: string
  ratio?: AspectRatio
  showControls?: boolean
  options?: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    loadingSpinner: boolean
  }
}

const PlayerInstance: FC<PlayerProps> = ({
  ratio,
  permanentUrl,
  posterUrl,
  playerRef,
  options,
  showControls
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
      showLoadingSpinner={options?.loadingSpinner}
      autoUrlUpload={{
        fallback: true,
        ipfsGateway: IPFS_GATEWAY
      }}
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  )
}

export default React.memo(PlayerInstance)
