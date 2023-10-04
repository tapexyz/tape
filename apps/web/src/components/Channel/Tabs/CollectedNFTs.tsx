import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { WORKER_NFTS_URL } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import type { CustomNftItemType } from '@tape.xyz/lens/custom-types'
import axios from 'axios'
import type { FC } from 'react'
import React from 'react'

import NFTCard from './NFTCard'

type Props = {
  channel: Profile
}

const CollectedNFTs: FC<Props> = ({ channel }) => {
  const fetchNfts = async () => {
    const { data } = await axios.get(`${WORKER_NFTS_URL}/${channel.handle}/200`)
    return data?.result
  }

  const { data, isLoading, error } = useQuery(
    ['nfts', channel.handle],
    () => fetchNfts().then((res) => res),
    {
      enabled: true
    }
  )

  // const { data, isLoading, error } = useSWR(
  //   `${NFTS_URL}/${channel.handle}/200`,
  //   (url: string) => fetch(url).then((res) => res.json()),
  //   {
  //     revalidateOnFocus: false,
  //     revalidateIfStale: false
  //   }
  // )

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
