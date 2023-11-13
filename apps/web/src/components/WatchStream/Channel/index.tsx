import InterweaveContent from '@components/Common/InterweaveContent'
import PublicationActions from '@components/Common/Publication/PublicationActions'
import UserProfile from '@components/Common/UserProfile'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_STREAM_URL } from '@tape.xyz/constants'
import type { PrimaryPublication, Profile } from '@tape.xyz/lens'
import { useProfileQuery, usePublicationQuery } from '@tape.xyz/lens'
import axios from 'axios'
import React, { memo } from 'react'
import Custom404 from 'src/pages/404'

import MoreVideos from '../MoreVideos'
import LiveVideo from './LiveVideo'

const Channel = ({ id }: { id: string }) => {
  const fetchChannelStream = async () => {
    const { data } = await axios.get(`${WORKER_STREAM_URL}/stream/${id}`)
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

  const { data: publicationData } = usePublicationQuery({
    variables: {
      request: {
        forId: streamData?.pid
      }
    },
    skip: !streamData?.pid
  })
  const publication = publicationData?.publication as PrimaryPublication

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
      <div className="flex items-center justify-between">
        <UserProfile profile={profile} />
        {publication && <PublicationActions publication={publication} />}
      </div>
      <MoreVideos />
    </div>
  )
}

export default memo(Channel)
