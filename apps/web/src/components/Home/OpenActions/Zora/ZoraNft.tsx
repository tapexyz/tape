import Modal from '@components/UIElements/Modal'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  LENSTUBE_ADDRESS,
  STATIC_ASSETS,
  ZORA_MAINNET_CHAINS
} from '@lenstube/constants'
import { trimLensHandle, useDid, useZoraNft } from '@lenstube/generic'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import { t } from '@lingui/macro'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

import Metadata from './Metadata'

type Props = {
  nftMetadata: BasicNftMetadata
}

const ZoraNft: FC<Props> = ({ nftMetadata }) => {
  const [showMintModal, setShowMintModal] = useState(false)

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
  }?referrer=${LENSTUBE_ADDRESS}`

  const coverImage = `https://remote-image.decentralized-content.com/image?url=${zoraNft.coverImageUrl}&w=1200&q=75`

  return (
    <div className="w-72 flex-none">
      <Modal
        title={t`Collect`}
        show={showMintModal}
        onClose={() => setShowMintModal(false)}
        panelClassName="max-w-6xl"
      >
        <Metadata nft={zoraNft} link={zoraLink} />
      </Modal>
      <div
        role="button"
        onClick={() => setShowMintModal(true)}
        className="aspect-h-9 aspect-w-16 relative overflow-hidden rounded-xl"
      >
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
      <div className="pt-2">
        <h1 className="ultrawide:break-all line-clamp-2 break-words font-semibold">
          {zoraNft?.name}
        </h1>
        <div className="flex items-center text-sm opacity-50">
          <span className="whitespace-nowrap">{trimLensHandle(did)}</span>
          <span className="middot" />
          <Link
            onClick={() => Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_ZORA)}
            href={zoraLink}
            target="_blank"
            className="flex items-center space-x-1 font-medium hover:text-indigo-500"
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
