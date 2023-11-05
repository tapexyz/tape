import Alert from '@components/Common/Alert'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { Button } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import Custom404 from 'src/pages/404'

import Meta from '../Meta'
import LiveVideo from './LiveVideo'

const Unlonely = ({ channel }: { channel: string }) => {
  const profile = channel.split(';')[1]

  const fetchUnlonelyStreams = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely/${profile}`)
    return data?.items[0] ?? null
  }

  const {
    data: liveItem,
    isLoading,
    error
  } = useQuery({
    queryKey: ['unlonelyChannel'],
    queryFn: fetchUnlonelyStreams,
    enabled: Boolean(profile)
  })

  if (isLoading) {
    return <VideoCardShimmer />
  }

  if (!liveItem || error) {
    return <Custom404 />
  }

  const { thumbnailUrl, playbackUrl, isLive } = liveItem

  return (
    <div className="space-y-3.5">
      <LiveVideo poster={thumbnailUrl} playback={playbackUrl} />
      <Meta live={liveItem} channel={channel} />
      {!isLive && (
        <Alert>
          <div className="flex w-full items-center justify-between">
            <span className="font-bold">
              Oops! This stream has ended. But don't worry, there's plenty more
              to explore!
            </span>
            <Link href="/">
              <Button highContrast>Go Home</Button>
            </Link>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default Unlonely
