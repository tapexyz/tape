import type { CustomNftItemType } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import PlayOutline from '@components/Common/Icons/PlayOutline'
import StopOutline from '@components/Common/Icons/StopOutline'
import {
  ETHERSCAN_URL,
  FALLBACK_THUMBNAIL_URL,
  POLYGONSCAN_URL
} from '@tape.xyz/constants'
import { sanitizeDStorageUrl } from '@tape.xyz/generic'
import Link from 'next/link'
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
            autoPlay
            className="aspect-[16/9] w-full"
            controls
            controlsList="nodownload noplaybackrate nofullscreen"
            disablePictureInPicture
            disableRemotePlayback
            loop
            muted
            poster={sanitizeDStorageUrl(nft.metaData.image)}
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
              className="aspect-h-9 aspect-w-16 z-0 bg-cover bg-no-repeat blur-xl"
              style={{
                backgroundImage: `url("${sanitizeDStorageUrl(
                  nft.metaData.image
                )}")`
              }}
            />
            <img
              alt={nft.metaData.name}
              className="object-contain"
              draggable={false}
              onError={({ currentTarget }) => {
                currentTarget.src = FALLBACK_THUMBNAIL_URL
              }}
              src={sanitizeDStorageUrl(
                nft.metaData.image || FALLBACK_THUMBNAIL_URL
              )}
            />
          </>
        )}
        <div className="static">
          <button
            className="absolute bottom-3 right-3 rounded-full bg-white p-3"
            onClick={() => setToggleVideo(!toggleVideo)}
          >
            {toggleVideo ? (
              <StopOutline className="size-4 text-black" />
            ) : (
              <PlayOutline className="size-4 text-black" />
            )}
          </button>
        </div>
      </div>

      <Link
        href={`${explorer}/nft/${nft.address}/${nft.tokenId}`.toLowerCase()}
        rel="noreferer noreferrer"
        target="_blank"
      >
        <div className="py-3">
          <div className="truncate text-sm uppercase">{nft.metaData.name}</div>
          <div
            className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 opacity-50"
            title={nft.metaData?.description}
          >
            {nft.metaData?.description}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NFTCard
