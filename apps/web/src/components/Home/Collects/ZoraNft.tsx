import {
  LENSTUBE_DONATION_ADDRESS,
  ZORA_MAINNET_CHAINS
} from '@lenstube/constants'
import { useZoraNft } from '@lenstube/generic'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import React from 'react'

const ZoraNft = ({ nftMetadata }: { nftMetadata: BasicNftMetadata }) => {
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
  console.log('🚀 ~ file: ZoraNft.tsx:21 ~ ZoraNft ~ zoraNft:', zoraNft)

  const canMint = [
    'ERC721_DROP',
    'ERC721_SINGLE_EDITION',
    'ERC1155_COLLECTION_TOKEN'
  ].includes(zoraNft.contractType)
  const network = ZORA_MAINNET_CHAINS.includes(chain) ? '' : 'testnet.'
  const zoraLink = `https://${network}zora.co/collect/${chain}:${address}${
    token ? `/${token}` : ''
  }?referrer=${LENSTUBE_DONATION_ADDRESS}`

  return <div>{address}</div>
}

export default ZoraNft
