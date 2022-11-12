import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { POLYGON_CHAIN_ID, SCROLL_ROOT_MARGIN } from '@utils/constants'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  PaginatedResultInfo,
  Profile,
  ProfileNfTsDocument
} from 'src/types/lens'
import { Nft } from 'src/types/lens'

import NFTCard from './NFTCard'

type Props = {
  channel: Profile
}

const request = {
  limit: 16,
  chainIds: [POLYGON_CHAIN_ID]
}

const CollectedNFTs: FC<Props> = ({ channel }) => {
  const [collectedNFTs, setCollectedNFTs] = useState<Nft[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()

  const { data, loading, error, fetchMore } = useQuery(ProfileNfTsDocument, {
    variables: {
      request: {
        ...request,
        ownerAddress: channel.ownedBy
      }
    },
    onCompleted(data) {
      setPageInfo(data?.nfts?.pageInfo)
      setCollectedNFTs(data?.nfts?.items as Nft[])
    }
  })

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              ownerAddress: channel.ownedBy,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.nfts?.pageInfo)
        setCollectedNFTs([...collectedNFTs, ...(data?.nfts?.items as Nft[])])
      } catch {}
    }
  })

  if (loading) return <TimelineShimmer />

  if (data?.nfts?.items?.length === 0) {
    return <NoDataFound isCenter withImage text="No NFTs found" />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <div className="grid gap-x-5 lg:grid-cols-4 md:gap-y-8 gap-y-2 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
            {collectedNFTs?.map((nft: Nft) => (
              <NFTCard
                key={`${nft.contractAddress}_${nft.tokenId}`}
                nft={nft}
              />
            ))}
          </div>
          {pageInfo?.next && collectedNFTs.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default CollectedNFTs
