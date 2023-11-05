import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import React from 'react'

import LiveVideo from './LiveVideo'

const Rad = () => {
  const fetchCurrentRadStream = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/rad`)
    return data?.item ?? null
  }

  const {
    data: liveItem,
    isLoading,
    error
  } = useQuery({
    queryKey: ['radChannel'],
    queryFn: fetchCurrentRadStream
  })

  if (isLoading) {
    return <VideoCardShimmer />
  }

  // if (!liveItem || error) {
  //   return <Custom404 />
  // }

  // const { title, description, playback, poster, lensHandle } = liveItem

  return (
    <div className="space-y-3.5">
      <LiveVideo
        poster={
          'https://gw.ipfs-lens.dev/ipfs/bafybeigjzxth756zl32nfrb3nbjyqeb2tne2hdqj5aqhjz3l47o2zzivhu'
        }
        playback={
          'https://gw.ipfs-lens.dev/ipfs/bafybeiem5h5h2fj56ip7qbbmbay5qqiqp7qd6av6jpex2gc3jxu6ai4yv4'
        }
      />
      {/* <Meta live={liveItem} /> */}
    </div>
  )
}

export default Rad
