import React, { FC } from 'react'
import { Nft } from 'src/types'

type Props = {
  NFTs: Nft[]
}

const NFTCards: FC<Props> = ({ NFTs }) => {
  return (
    <div className="grid gap-x-5 lg:grid-cols-4 md:gap-y-8 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
      {NFTs?.map((nft: Nft) => (
        <div
          key={`${nft.chainId}/${nft.contractAddress}/${nft.tokenId}`}
          className="bg-gray-50 rounded-xl dark:bg-[#181818] group"
        >
          <div className="h-56 border-b">
            {nft.originalContent.animatedUrl ? (
              <iframe
                src={nft.originalContent.animatedUrl}
                sandbox="allow-scripts"
                className="w-full h-full rounded-t-[10px]"
              ></iframe>
            ) : (
              <img
                className="h-full w-full"
                src={nft.originalContent.uri}
                alt="nft"
              ></img>
            )}
          </div>
          <div className="mt-2 p-2">
            <div className="text-sm text-gray-500 truncate">
              {nft.collectionName}
            </div>
            <div>{nft.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NFTCards
