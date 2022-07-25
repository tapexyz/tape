import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { COLLECTED_NFTS_QUERY } from '@utils/gql/queries'
import dynamic from 'next/dynamic'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo, Profile } from 'src/types'
import { Nft } from 'src/types'
const Timeline = dynamic(() => import('./NFTCards'), {
  loading: () => <TimelineShimmer />
})

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
        logger.error('[Error Fetch NFTs]', error)
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
          <Timeline NFTs={collectedNFTs} />
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
