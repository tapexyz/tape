import {
  STATIC_ASSETS,
  TAPE_ADMIN_ADDRESS,
  ZORA_MAINNET_CHAINS
} from '@dragverse/constants'
import { EVENTS, Tower } from '@dragverse/generic'
import type { BasicNftMetadata } from '@dragverse/lens/custom-types'
import { useDid } from '@hooks/useDid'
import { useZoraNft } from '@hooks/useZoraNft'
import { Dialog } from '@radix-ui/themes'
import Link from 'next/link'
import type { FC } from 'react'

import Metadata from './Metadata'

type Props = {
  nftMetadata: BasicNftMetadata
}

const ZoraNft: FC<Props> = ({ nftMetadata }) => {
  const { chain, address, token } = nftMetadata

  const { data: zoraNft, loading } = useZoraNft({
    chain: chain,
    token: token,
    address: address,
    enabled: Boolean(chain && address)
  })

  const { did } = useDid({
    address: zoraNft?.creator,
    enabled: Boolean(zoraNft?.creator)
  })

  if (loading) {
    return <div className="h-56 w-72" />
  }

  const network = ZORA_MAINNET_CHAINS.includes(chain) ? '' : 'testnet.'
  const zoraLink = `https://${network}zora.co/collect/${chain}:${address}${
    token ? `/${token}` : ''
  }?referrer=${TAPE_ADMIN_ADDRESS}`

  const coverImage = `https://remote-image.decentralized-content.com/image?url=${zoraNft.coverImageUrl}&w=1200&q=75`

  return (
    <div className="w-72 flex-none">
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="aspect-h-9 aspect-w-16 relative overflow-hidden rounded-xl">
            <div
              style={{
                backgroundImage: `url("${coverImage}")`
              }}
              className="aspect-h-9 aspect-w-16 z-0 bg-cover bg-no-repeat blur-xl"
            />
            <img
              src={coverImage}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
              alt="thumbnail"
              draggable={false}
            />
          </div>
        </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Collect</Dialog.Title>

          <Metadata nft={zoraNft} link={zoraLink} />
        </Dialog.Content>
      </Dialog.Root>

      <div className="pt-2">
        <h1 className="ultrawide:break-all line-clamp-2 break-words font-bold">
          {zoraNft?.name}
        </h1>
        <div className="flex items-center text-sm opacity-50">
          <span className="whitespace-nowrap">{did}</span>
          <span className="middot" />
          <Link
            onClick={() => Tower.track(EVENTS.OPEN_ACTIONS.OPEN_IN_ZORA)}
            href={zoraLink}
            target="_blank"
            className="flex items-center space-x-1 font-medium hover:text-golden-500"
          >
            <img
              src={`${STATIC_ASSETS}/images/zora.png`}
              className="h-3 w-3 rounded-lg"
              alt=""
            />
            <span>zora</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ZoraNft
