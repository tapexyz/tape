import LiveStreamCard from '@components/Common/LiveStreamCard'
import WhatsPoppingSectionShimmer from '@components/Shimmers/WhatsPoppingSectionShimmer'
import { useQuery } from '@tanstack/react-query'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { STATIC_ASSETS, WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

const UnlonelyStreams = () => {
  const fetchStreams = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely`)
    return data?.items
  }

  const {
    data: liveItems,
    isLoading,
    error
  } = useQuery(['unlonely'], () => fetchStreams().then((res) => res), {
    enabled: true,
    refetchInterval: 10_000
  })

  if (isLoading) {
    return <WhatsPoppingSectionShimmer />
  }

  if (!liveItems?.length || error) {
    return null
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
          description={live.description}
          thumbnailUrl={live.thumbnailUrl}
          username={live.slug}
          slug={`unlonely:${live.slug}`}
          app={
            <Link
              onClick={() =>
                Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_UNLONELY)
              }
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
