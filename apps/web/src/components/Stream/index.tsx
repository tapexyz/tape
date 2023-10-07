import Alert from '@components/Common/Alert'
import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Button } from '@components/UIElements/Button'
import SuggestedVideos from '@components/Watch/SuggestedVideos'
import { t } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import LiveVideo from './LiveVideo'
import Meta from './Meta'

const StreamDetails = () => {
  const {
    query: { slug }
  } = useRouter()

  const channel = (slug as string).split(':')[1]

  const fetchNfts = async () => {
    const { data } = await axios.get(`${WORKER_LIVE_URL}/unlonely/${channel}`)
    return data?.items[0]
  }

  const {
    data: liveItem,
    isLoading,
    error
  } = useQuery(['unlonelyDetail'], () => fetchNfts().then((res) => res), {
    enabled: true
  })

  if (isLoading) {
    return <VideoDetailShimmer />
  }

  if (!liveItem) {
    return <Custom404 />
  }

  const { thumbnailUrl, playbackUrl, isLive } = liveItem

  return (
    <>
      <MetaTags title={t`Live`} />
      {!isLoading && !error && liveItem ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <LiveVideo thumbnailUrl={thumbnailUrl} playbackUrl={playbackUrl} />
            <Meta live={liveItem} channel={channel} />
            {!isLive && (
              <Alert>
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold">
                    Oops! This stream has ended. But don't worry, there's plenty
                    more to explore!
                  </span>
                  <Link href="/">
                    <Button size="sm">Go Home</Button>
                  </Link>
                </div>
              </Alert>
            )}
          </div>
          <div className="col-span-1">
            <SuggestedVideos />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default StreamDetails
