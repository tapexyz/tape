import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { useQuery } from '@tanstack/react-query'
import { WORKER_NFTS_URL } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import type { CustomNftItemType } from '@tape.xyz/lens/custom-types'
import axios from 'axios'
import type { FC } from 'react'
import React from 'react'

import NFTCard from './NFTCard'

type Props = {
  profile: Profile
}

const CollectedNFTs: FC<Props> = ({ profile }) => {
  const fetchNfts = async () => {
    const { data } = await axios.get(
      `${WORKER_NFTS_URL}/${profile.handle?.localName}/200`
    )
    return data?.result
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNfts,
    enabled: true
  })

  const nfts = data?.items

  if (isLoading) {
    return <TimelineShimmer className="laptop:!grid-cols-3" />
  }

  if (nfts?.length === 0) {
    return <NoDataFound isCenter withImage text="No NFTs found" />
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
