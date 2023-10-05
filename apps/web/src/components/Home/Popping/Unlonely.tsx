import LiveStreamCard from '@components/Common/LiveStreamCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { WORKER_LIVE_URL } from '@lenstube/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'

const Unlonely = () => {
  const fetchNfts = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely`)
    return data?.items
  }

  const {
    data: liveItems,
    isLoading,
    error
  } = useQuery(['unlonely'], () => fetchNfts().then((res) => res), {
    enabled: true
  })
  console.log('🚀 ~ file: Unlonely.tsx:13 ~ Unlonely ~ data:', liveItems)

  if (isLoading) {
    return <TimelineShimmer count={5} />
  }

  if (!liveItems?.length || error) {
    return
  }

  return (
    <div className="laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8 2xl:grid-cols-5">
      {liveItems.map((live: any) => (
        <LiveStreamCard
          key={live.slug}
          address={live.owner.address}
          description={live.description}
          createdAt={live.updatedAt}
          isLive={live.isLive}
          name={live.name}
          thumbnailUrl={live.thumbnailUrl}
          username={live.slug}
          externalUrl={`https://www.unlonely.app/channels/${live.slug}`}
          appName="Unlonely"
        />
      ))}
    </div>
  )
}

export default Unlonely
