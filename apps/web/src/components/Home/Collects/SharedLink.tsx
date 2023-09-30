import { getCrossChainNftMetadata, getURLs } from '@lenstube/generic'
import type { MetadataOutput } from '@lenstube/lens'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import React from 'react'

import ZoraNft from './ZoraNft'

const SharedLink = ({ metadata }: { metadata: MetadataOutput }) => {
  const content = metadata.content
  const urls = getURLs(content)
  const nftMetadata = getCrossChainNftMetadata(urls)
  if (!nftMetadata) {
    return null
  }

  const provider = nftMetadata?.provider
  return provider === 'zora' ? (
    <ZoraNft nftMetadata={nftMetadata as BasicNftMetadata} />
  ) : null
}

export default SharedLink
