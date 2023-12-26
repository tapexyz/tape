import type { AspectRatio } from '@livepeer/react'
import type { FC } from 'react'

import { Player } from '@livepeer/react'
import { ARWEAVE_GATEWAY_URL, IPFS_GATEWAY_URL } from '@tape.xyz/constants'
import React from 'react'

export interface PlayerProps {
  address?: string
  options: {
    autoPlay?: boolean
    isCurrentlyShown?: boolean
    loadingSpinner: boolean
    loop?: boolean
    maxHeight?: boolean
    muted?: boolean
  }
  playerRef?: (ref: HTMLMediaElement) => void
  posterUrl?: string
  ratio?: AspectRatio
  shouldUpload?: boolean
  showControls?: boolean
  url?: string
}

const PlayerInstance: FC<PlayerProps> = ({
  address,
  options,
  playerRef,
  posterUrl,
  ratio,
  shouldUpload,
  showControls,
  url
}) => {
  return (
    <Player
      _isCurrentlyShown={options.isCurrentlyShown ?? true}
      aspectRatio={ratio}
      autoPlay={options.autoPlay ?? false}
      autoUrlUpload={
        shouldUpload
          ? {
              arweaveGateway: ARWEAVE_GATEWAY_URL,
              fallback: true,
              ipfsGateway: IPFS_GATEWAY_URL
            }
          : undefined
      }
      controls={{ defaultVolume: 1 }}
      loop={options.loop ?? true}
      mediaElementRef={playerRef}
      muted={options?.muted ?? false}
      objectFit="contain"
      poster={posterUrl}
      refetchPlaybackInfoInterval={1000 * 60 * 60 * 24 * 7} // to disable hls refetching every second
      showLoadingSpinner={options.loadingSpinner}
      showPipButton
      showTitle={false}
      showUploadingIndicator={false}
      src={
        url?.includes(ARWEAVE_GATEWAY_URL)
          ? url.replace(`${ARWEAVE_GATEWAY_URL}/`, 'ar://')
          : url
      }
      viewerId={address}
    >
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      {!showControls ? <></> : null}
    </Player>
  )
}

export default React.memo(PlayerInstance)
