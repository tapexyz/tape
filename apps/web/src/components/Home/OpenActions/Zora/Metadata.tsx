import CollectOutline from '@components/Common/Icons/CollectOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import { Button } from '@components/UIElements/Button'
import {
  getRandomProfilePicture,
  sanitizeDStorageUrl,
  shortenAddress,
  useDid
} from '@lenstube/generic'
import type { ZoraNft } from '@lenstube/lens/custom-types'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'
import { formatEther } from 'viem'

import Collect from './Collect'

const Metadata = ({ nft, link }: { nft: ZoraNft; link: string }) => {
  const canMint = [
    'ERC721_DROP',
    'ERC721_SINGLE_EDITION',
    'ERC1155_COLLECTION_TOKEN'
  ].includes(nft.contractType)

  const { did } = useDid({
    address: nft?.creator,
    enabled: Boolean(nft?.creator)
  })

  return (
    <div>
      <div className="space-y-2">
        <video
          className="aspect-[16/9] w-full rounded-lg"
          disablePictureInPicture
          disableRemotePlayback
          autoPlay
          controlsList="nodownload noplaybackrate nofullscreen"
          poster={sanitizeDStorageUrl(nft.coverImageUrl)}
          controls
          src={sanitizeDStorageUrl(nft.mediaUrl)}
        >
          <source src={sanitizeDStorageUrl(nft.mediaUrl)} type="video/mp4" />
        </video>
        <h1 className="font-semibold">{nft?.name}</h1>
        <div className="flex items-center space-x-1">
          <img
            src={getRandomProfilePicture(nft.creator)}
            className="h-5 w-5 rounded-full"
            alt=""
          />
          <span> {did ?? shortenAddress(nft.creator)}</span>
        </div>
        <p className="line-clamp-4 break-words" title={nft.description}>
          {nft?.description}
        </p>
        <div className="flex items-center space-x-2 outline-none">
          <CollectOutline className="h-4 w-4" />
          <span>
            {nft.totalMinted} <Trans>collects</Trans>
          </span>
        </div>
        <div className="flex items-center space-x-2 outline-none">
          <TagOutline className="h-4 w-4" />
          <span>
            {formatEther(BigInt(nft.price))} <Trans>ETH</Trans>
          </span>
        </div>
      </div>
      {canMint ? (
        <Collect nft={nft} link={link} />
      ) : (
        <div className="mt-4 flex justify-end">
          <Link href={link} target="_blank">
            <Button>Collect</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Metadata
