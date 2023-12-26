import type { PrimaryPublication, Profile } from '@tape.xyz/lens'

import InterweaveContent from '@components/Common/InterweaveContent'
import PublicationActions from '@components/Common/Publication/PublicationActions'
import PublicationComments from '@components/Common/Publication/PublicationComments'
import UserProfile from '@components/Common/UserProfile'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { useQuery } from '@tanstack/react-query'
import { WORKER_STREAM_URL } from '@tape.xyz/constants'
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
    error,
    isLoading
  } = useQuery({
    queryFn: fetchChannelStream,
    queryKey: ['channelStream', id]
  })

  const { data } = useProfileQuery({
    skip: !streamData?.streamer,
    variables: {
      request: {
        forHandle: streamData?.streamer
      }
    }
  })
  const profile = data?.profile as Profile

  const { data: publicationData } = usePublicationQuery({
    skip: !streamData?.pid,
    variables: {
      request: {
        forId: streamData?.pid
      }
    }
  })
  const publication = publicationData?.publication as PrimaryPublication

  if (isLoading) {
    return <VideoCardShimmer />
  }

  if (!streamData || error) {
    return <Custom404 />
  }

  return (
    <div className="space-y-5">
      <LiveVideo
        playback={streamData.playbackUrl}
        poster={streamData.posterUrl}
      />
      <div className="space-y-1">
        <h1 className="line-clamp-2 font-bold md:text-xl">
          <InterweaveContent content={streamData.title} />
        </h1>
        <p>
          <InterweaveContent content={streamData.content} />
        </p>
      </div>
      <div className="flex items-center justify-between">
        <UserProfile profile={profile} />
        {publication && <PublicationActions publication={publication} />}
      </div>
      {publication && (
        <div>
          <PublicationComments publication={publication} />
        </div>
      )}
      <MoreVideos />
    </div>
  )
}

export default memo(Channel)
