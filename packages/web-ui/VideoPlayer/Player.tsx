import { IPFS_GATEWAY_URL, IS_PRODUCTION } from '@lenstube/constants'
import type { AspectRatio } from '@livepeer/react'
import { Player } from '@livepeer/react'
import type { FC } from 'react'
import React from 'react'

export interface PlayerProps {
  playerRef?: (ref: HTMLMediaElement) => void
  permanentUrl: string
  posterUrl?: string
  hlsUrl?: string
  ratio?: AspectRatio
  showControls?: boolean
  address?: string
  options: {
    autoPlay?: boolean
    muted?: boolean
    loop?: boolean
    loadingSpinner: boolean
    isCurrentlyShown: boolean
  }
}

const PlayerInstance: FC<PlayerProps> = ({
  ratio,
  permanentUrl,
  hlsUrl,
  posterUrl,
  playerRef,
  options,
  address,
  showControls
}) => {
  return (
    <Player
      src={hlsUrl ?? permanentUrl}
      poster={posterUrl}
      showTitle={false}
      objectFit="contain"
      aspectRatio={ratio}
      showPipButton
      viewerId={address}
      mediaElementRef={playerRef}
      loop={options.loop ?? true}
      showUploadingIndicator={false}
      muted={options?.muted ?? false}
      controls={{ defaultVolume: 1 }}
      autoPlay={options.autoPlay ?? false}
      showLoadingSpinner={options.loadingSpinner}
      _isCurrentlyShown={options.isCurrentlyShown}
      autoUrlUpload={
        IS_PRODUCTION && {
          fallback: true,
          ipfsGateway: IPFS_GATEWAY_URL
        }
      }
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  )
}

export default React.memo(PlayerInstance)
