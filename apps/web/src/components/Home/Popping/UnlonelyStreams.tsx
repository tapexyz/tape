import LiveStreamCard from '@components/Common/LiveStreamCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { STATIC_ASSETS, WORKER_LIVE_URL } from '@lenstube/constants'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

const UnlonelyStreams = () => {
  const fetchNfts = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely`)
    return data?.items
  }

  const {
    data: liveItems,
    isLoading,
    error
  } = useQuery(['unlonely'], () => fetchNfts().then((res) => res), {
    enabled: true,
    refetchInterval: 10_000
  })

  if (isLoading) {
    return <TimelineShimmer count={5} />
  }

  if (!liveItems?.length || error) {
    return
  }

  return (
    <div>
      {liveItems.map((live: any) => (
        <LiveStreamCard
          key={live.slug}
          address={live.owner.address}
          createdAt={live.updatedAt}
          isLive={live.isLive}
          name={live.name}
          thumbnailUrl={live.thumbnailUrl}
          username={live.slug}
          app={
            <Link
              href={`https://www.unlonely.app/channels/${live.slug}`}
              target="_blank"
              className="flex items-center space-x-1 font-medium hover:text-indigo-500"
            >
              <img
                src={`${STATIC_ASSETS}/images/unlonely.png`}
                alt=""
                className="h-3 w-3 rounded-lg"
              />
              <span>Unlonely</span>
            </Link>
          }
        />
      ))}
    </div>
  )
}

export default UnlonelyStreams
