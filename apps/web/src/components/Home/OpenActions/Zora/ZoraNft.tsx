import CollectOutline from '@components/Common/Icons/CollectOutline'
import UserPreview from '@components/Common/UserPreview'
import Modal from '@components/UIElements/Modal'
import { LENSTUBE_ADDRESS, ZORA_MAINNET_CHAINS } from '@lenstube/constants'
import { trimLensHandle, useZoraNft } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import { getShortHandTime } from '@lib/formatTime'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'

import Metadata from './Metadata'

type Props = {
  nftMetadata: BasicNftMetadata
  sharedBy: Profile
  postedAt: string
}

const ZoraNft: FC<Props> = ({ nftMetadata, sharedBy, postedAt }) => {
  const [showMintModal, setShowMintModal] = useState(false)

  const { chain, address, token } = nftMetadata

  const { data: zoraNft, loading } = useZoraNft({
    chain: chain,
    token: token,
    address: address,
    enabled: Boolean(chain && address)
  })

  if (loading) {
    return null
  }

  const network = ZORA_MAINNET_CHAINS.includes(chain) ? '' : 'testnet.'
  const zoraLink = `https://${network}zora.co/collect/${chain}:${address}${
    token ? `/${token}` : ''
  }?referrer=${LENSTUBE_ADDRESS}`

  const coverImage = `https://remote-image.decentralized-content.com/image?url=${zoraNft.coverImageUrl}&w=1200&q=75`

  return (
    <div>
      <Modal
        title={t`Collect`}
        show={showMintModal}
        onClose={() => setShowMintModal(false)}
        panelClassName="max-w-2xl"
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
        <div>
          <div className="absolute bottom-1 right-1 flex items-center space-x-1 rounded-full bg-black px-3 py-1 text-sm font-semibold text-white">
            <CollectOutline className="h-4 w-4" />
            <span>
              <Trans>Collect</Trans>
            </span>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <h1 className="ultrawide:break-all line-clamp-2 break-words font-semibold">
          {zoraNft?.name}
        </h1>
        <p className="ultrawide:break-all line-clamp-1 break-words text-sm">
          {zoraNft?.description}
        </p>
        <div className="flex items-center text-sm opacity-50">
          <UserPreview profile={sharedBy}>
            <span className="ultrawide:break-all line-clamp-1 break-words">
              shared by {trimLensHandle(sharedBy?.handle)}
            </span>
          </UserPreview>
          <span className="middot" />
          {postedAt && (
            <span className="whitespace-nowrap">
              {getShortHandTime(postedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ZoraNft
