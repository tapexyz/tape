import { getOpenActionNftMetadata, getURLs } from '@lenstube/generic'
import type { MetadataOutput } from '@lenstube/lens'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React from 'react'

import ZoraNft from './Zora/ZoraNft'

type Props = {
  metadata: MetadataOutput
}

const SharedLink: FC<Props> = ({ metadata }) => {
  const content = metadata.content
  const urls = getURLs(content)
  const nftMetadata = getOpenActionNftMetadata(urls)
  if (!nftMetadata) {
    return null
  }

  const provider = nftMetadata?.provider
  return provider === 'zora' ? (
    <ZoraNft nftMetadata={nftMetadata as BasicNftMetadata} />
  ) : null
}

export default SharedLink
