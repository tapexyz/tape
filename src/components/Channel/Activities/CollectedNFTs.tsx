import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { COLLECTED_NFTS_QUERY } from '@utils/gql/queries'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo, Profile } from 'src/types'
import { Nft } from 'src/types'

import NFTCard from './NFTCard'

type Props = {
  channel: Profile
}

const CollectedNFTs: FC<Props> = ({ channel }) => {
  const [collectedNFTs, setCollectedNFTs] = useState<Nft[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(COLLECTED_NFTS_QUERY, {
    variables: {
      request: {
        ownerAddress: channel.ownedBy,
        limit: 8,
        chainIds: [POLYGON_CHAIN_ID]
      }
    },
    onCompleted(data) {
      setPageInfo(data?.nfts?.pageInfo)
      setCollectedNFTs(data?.nfts?.items)
    }
  })
  const { observe } = useInView({
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ownerAddress: channel.ownedBy,
              limit: 8,
              cursor: pageInfo?.next,
              chainIds: [POLYGON_CHAIN_ID]
            }
          }
        })
        setPageInfo(data?.nfts?.pageInfo)
        setCollectedNFTs([...collectedNFTs, ...data?.nfts?.items])
      } catch (error) {
        logger.error('[Error Fetch Collected NFTs]', error)
      }
    }
  })

  if (loading) return <TimelineShimmer />

  if (data?.publications?.items?.length === 0) {
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
