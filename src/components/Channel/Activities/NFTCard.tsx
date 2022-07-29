import {
  IS_MAINNET,
  NFT_MARKETPLACE_URL,
  STATIC_ASSETS
} from '@utils/constants'
import imageCdn from '@utils/functions/imageCdn'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import Link from 'next/link'
import React, { FC } from 'react'
import { Nft } from 'src/types'

type Props = {
  nft: Nft
}

const NFTCard: FC<Props> = ({ nft }) => {
  return (
    <div className="bg-gray-50 rounded-xl dark:bg-[#181818] group">
      <div className="aspect-h-9 aspect-w-16">
        {nft?.originalContent?.animatedUrl ? (
          <iframe
            className="w-full h-full sm:rounded-t-[10px]"
            src={nft?.originalContent?.animatedUrl}
          />
        ) : (
          <img
            className="object-cover w-full h-full rounded-t-xl"
            src={imageCdn(
              nft.originalContent?.uri
                ? sanitizeIpfsUrl(nft.originalContent?.uri)
                : `${STATIC_ASSETS}/images/placeholder.webp`,
              'thumbnail'
            )}
            alt={nft.name}
          />
        )}
      </div>
      <Link
        href={`${NFT_MARKETPLACE_URL}/assets/${
          IS_MAINNET ? 'matic/' : 'mumbai/'
        }${nft.contractAddress}/${nft.tokenId}`.toLowerCase()}
      >
        <a target="_blank" rel="noreferer noreferrer">
          <div className="p-3">
            <div className="text-xs text-gray-500 uppercase truncate">
              {nft.collectionName}
            </div>
            <div className="line-clamp-2">{nft.name}</div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default NFTCard
