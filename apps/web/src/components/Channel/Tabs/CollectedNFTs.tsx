import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { NFTS_URL } from '@lenstube/constants'
import type { Profile } from '@lenstube/lens'
import type { CustomNftItemType } from '@lenstube/lens/custom-types'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'
import useSWR from 'swr'

import NFTCard from './NFTCard'

type Props = {
  profile: Profile
}

const CollectedNFTs: FC<Props> = ({ profile }) => {
  const { data, isLoading, error } = useSWR(
    `${NFTS_URL}/${profile.handle}/200`,
    (url: string) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  )

  const nfts = data?.items

  if (isLoading) {
    return <TimelineShimmer className="laptop:!grid-cols-3" />
  }

  if (nfts?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No NFTs found`} />
  }

  return (
    <div className="w-full">
      {!error && !isLoading && (
        <div className="laptop:grid-cols-3 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8">
          {nfts?.map((nft: CustomNftItemType) => (
            <NFTCard key={`${nft.address}_${nft.tokenId}`} nft={nft} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CollectedNFTs
