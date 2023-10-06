import CollectOutline from '@components/Common/Icons/CollectOutline'
import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import TagOutline from '@components/Common/Icons/TagOutline'
import { Button } from '@components/UIElements/Button'
import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  getRandomProfilePicture,
  sanitizeDStorageUrl,
  shortenAddress,
  useDid
} from '@tape.xyz/generic'
import type { ZoraNft } from '@tape.xyz/lens/custom-types'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
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
      <div className="space-y-4">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
          <VideoPlayer
            hlsUrl={sanitizeDStorageUrl(nft.mediaUrl)}
            permanentUrl={sanitizeDStorageUrl(nft.mediaUrl)}
            posterUrl={sanitizeDStorageUrl(nft.coverImageUrl)}
            options={{
              isCurrentlyShown: true,
              loadingSpinner: true,
              autoPlay: true
            }}
          />
        </div>
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
        <div className="space-y-2 font-semibold">
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
          <Link
            onClick={() => Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_ZORA)}
            href={link}
            target="_blank"
            className="inline-flex flex-wrap items-center space-x-2 outline-none"
          >
            <ExternalOutline className="h-3.5 w-3.5" />
            <span>Open in Zora</span>
          </Link>
        </div>
      </div>
      {canMint ? (
        <Collect nft={nft} link={link} />
      ) : (
        <div className="mt-4 flex justify-end md:mt-8">
          <Link href={link} target="_blank">
            <Button>Collect</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Metadata
