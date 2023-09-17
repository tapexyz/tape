import PlayOutline from '@components/Common/Icons/PlayOutline'
import StopOutline from '@components/Common/Icons/StopOutline'
import {
  ETHERSCAN_URL,
  FALLBACK_COVER_URL,
  POLYGONSCAN_URL
} from '@lenstube/constants'
import { sanitizeDStorageUrl } from '@lenstube/generic'
import type { CustomNftItemType } from '@lenstube/lens/custom-types'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
  nft: CustomNftItemType
}

const NFTCard: FC<Props> = ({ nft }) => {
  const getExplorerLink = (chainId: string) => {
    switch (chainId) {
      case '1':
        return ETHERSCAN_URL
      default:
        return POLYGONSCAN_URL
    }
  }

  const explorer = getExplorerLink(nft.chainId)

  const [toggleVideo, setToggleVideo] = useState(false)

  return (
    <div className="relative overflow-hidden">
      <div className="aspect-h-9 aspect-w-16 relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        {toggleVideo ? (
          <video
            className="aspect-[16/9] w-full"
            disablePictureInPicture
            disableRemotePlayback
            autoPlay
            muted
            loop
            controlsList="nodownload noplaybackrate nofullscreen"
            poster={sanitizeDStorageUrl(nft.metaData.image)}
            controls
            src={sanitizeDStorageUrl(
              nft.contentValue.video || nft.contentValue.audio
            )}
          >
            <source
              src={sanitizeDStorageUrl(
                nft.contentValue.video || nft.contentValue.audio
              )}
              type="video/mp4"
            />
          </video>
        ) : (
          <>
            <div
              style={{
                backgroundImage: `url("${sanitizeDStorageUrl(
                  nft.metaData.image
                )}")`
              }}
              className="aspect-h-9 aspect-w-16 z-0 bg-cover bg-no-repeat blur-xl"
            />
            <img
              src={sanitizeDStorageUrl(
                nft.metaData.image || FALLBACK_COVER_URL
              )}
              className="object-contain"
              alt={nft.metaData.name}
              draggable={false}
              onError={({ currentTarget }) => {
                currentTarget.src = FALLBACK_COVER_URL
              }}
            />
          </>
        )}
        <div className="static">
          <button
            onClick={() => setToggleVideo(!toggleVideo)}
            className="absolute bottom-3 right-3 rounded-full bg-white p-3"
          >
            {toggleVideo ? (
              <StopOutline className="h-4 w-4 text-black" />
            ) : (
              <PlayOutline className="h-4 w-4 text-black" />
            )}
          </button>
        </div>
      </div>

      <Link
        href={`${explorer}/nft/${nft.address}/${nft.tokenId}`.toLowerCase()}
        target="_blank"
        rel="noreferer noreferrer"
      >
        <div className="py-3">
          <div className="truncate text-sm uppercase">{nft.metaData.name}</div>
          <div
            title={nft.metaData?.description}
            className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 opacity-50"
          >
            {nft.metaData?.description}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NFTCard
