import { getOpenActionNftMetadata, getURLs } from '@dragverse/generic'
import type { LinkMetadataV3, Profile } from '@dragverse/lens'
import type { BasicNftMetadata } from '@dragverse/lens/custom-types'
import type { FC } from 'react'

import ZoraNft from './Zora/ZoraNft'

type Props = {
  metadata: LinkMetadataV3
  sharedBy: Profile
  postedAt: string
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
