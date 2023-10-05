import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import SuggestedVideos from '@components/Watch/SuggestedVideos'
import { WORKER_LIVE_URL } from '@lenstube/constants'
import { t } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import LiveVideo from './LiveVideo'

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

  const { thumbnailUrl, playbackUrl } = liveItem

  return (
    <>
      <MetaTags title={t`Live`} />
      {!isLoading && !error && liveItem ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <LiveVideo thumbnailUrl={thumbnailUrl} playbackUrl={playbackUrl} />
            <hr className="border-[0.5px] border-gray-200 dark:border-gray-800" />
            {/* <AboutChannel video={video} /> */}
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
