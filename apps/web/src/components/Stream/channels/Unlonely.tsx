import Alert from '@components/Common/Alert'
import VideoCardShimmer from '@components/Shimmers/VideoCardShimmer'
import { Button } from '@components/UIElements/Button'
import { useQuery } from '@tanstack/react-query'
import { WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import Custom404 from 'src/pages/404'

import LiveVideo from '../LiveVideo'
import Meta from '../Meta'

const Unlonely = ({ channel }: { channel: string }) => {
  const fetchNfts = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely/${channel}`)
    return data?.items[0]
  }

  const {
    data: liveItem,
    isLoading,
    error
  } = useQuery(['unlonelyChannel'], () => fetchNfts().then((res) => res), {
    enabled: true
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
      <LiveVideo thumbnailUrl={thumbnailUrl} playbackUrl={playbackUrl} />
      <Meta live={liveItem} channel={channel} />
      {!isLive && (
        <Alert>
          <div className="flex w-full items-center justify-between">
            <span className="font-semibold">
              Oops! This stream has ended. But don't worry, there's plenty more
              to explore!
            </span>
            <Link href="/">
              <Button size="sm">Go Home</Button>
            </Link>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default Unlonely
