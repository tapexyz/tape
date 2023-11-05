import UserProfile from '@components/Common/UserProfile'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_LIVE_URL } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import axios from 'axios'
import React from 'react'
import Custom404 from 'src/pages/404'

import MoreVideos from '../MoreVideos'
import LiveVideo from './LiveVideo'

const Rad = () => {
  const fetchCurrentRadStream = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/rad`)
    return data?.item ?? null
  }

  const {
    data: radData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['radChannel'],
    queryFn: fetchCurrentRadStream
  })

  const { data } = useProfileQuery({
    variables: {
      request: {
        forHandle: radData?.lensHandle
      }
    },
    skip: !radData?.lensHandle
  })
  const profile = data?.profile as Profile

  if (isLoading) {
    return <VideoCardShimmer />
  }

  if (!radData || error) {
    return <Custom404 />
  }

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
      <div className="flex items-center">
        <UserProfile profile={profile} />
      </div>
      <MoreVideos />
    </div>
  )
}

export default Rad
