import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import MetaTags from '@components/Common/MetaTags'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import SuggestedVideos from '@components/Watch/SuggestedVideos'
import { getShortHandTime } from '@lib/formatTime'
import { t } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { STATIC_ASSETS, WORKER_LIVE_URL } from '@tape.xyz/constants'
import axios from 'axios'
import Link from 'next/link'
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

  const { thumbnailUrl, playbackUrl, name, updatedAt, description } = liveItem

  return (
    <>
      <MetaTags title={t`Live`} />
      {!isLoading && !error && liveItem ? (
        <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
          <div className="col-span-3 space-y-3.5">
            <LiveVideo thumbnailUrl={thumbnailUrl} playbackUrl={playbackUrl} />
            <div className="py-1">
              <div className="flex items-center justify-between space-x-2.5">
                <div className="w-3/4">
                  <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
                    <div className="ultrawide:break-all line-clamp-2 break-words text-xl font-semibold">
                      {name}
                    </div>
                  </div>
                  <p className="line-clamp-1">{description}</p>
                </div>
                <div className="flex items-center overflow-hidden pt-6 opacity-70">
                  <span>{channel}</span>
                  <span className="middot" />
                  {updatedAt && (
                    <span className="whitespace-nowrap">
                      {getShortHandTime(updatedAt)}
                    </span>
                  )}
                  <span className="middot" />
                  <Link
                    onClick={() =>
                      Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_UNLONELY)
                    }
                    href={`https://www.unlonely.app/channels/${channel}`}
                    target="_blank"
                    className="flex items-center space-x-1 font-medium hover:text-indigo-500"
                  >
                    <img
                      src={`${STATIC_ASSETS}/images/unlonely.png`}
                      alt=""
                      className="h-5 w-5 rounded-lg"
                    />
                    <span>Unlonely</span>
                    <ExternalOutline className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
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
