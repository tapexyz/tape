import InterweaveContent from '@components/Common/InterweaveContent'
import UserProfile from '@components/Common/UserProfile'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_STREAM_URL } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import axios from 'axios'
import React from 'react'
import Custom404 from 'src/pages/404'

import MoreVideos from '../MoreVideos'
import LiveVideo from './LiveVideo'

const Channel = ({ id }: { id: string }) => {
  const fetchChannelStream = async () => {
    const { data } = await axios.get(`${WORKER_STREAM_URL}/channel/${id}`)
    return data?.item ?? null
  }

  const {
    data: streamData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['channelStream', id],
    queryFn: fetchChannelStream
  })

  const { data } = useProfileQuery({
    variables: {
      request: {
        forHandle: streamData?.streamer
      }
    },
    skip: !streamData?.streamer
  })
  const profile = data?.profile as Profile

  if (isLoading) {
    return <VideoCardShimmer />
  }

  if (!streamData || error) {
    return <Custom404 />
  }

  return (
    <div className="space-y-3.5">
      <LiveVideo
        poster={streamData.posterUrl}
        playback={streamData.playbackUrl}
      />
      <h1 className="line-clamp-2 font-bold md:text-xl">
        <InterweaveContent content={streamData.title} />
      </h1>
      <p>
        <InterweaveContent content={streamData.content} />
      </p>
      <div className="flex items-center">
        <UserProfile profile={profile} />
      </div>
      <MoreVideos />
    </div>
  )
}

export default Channel
