import Alert from '@components/Common/Alert'
import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import MetaTags from '@components/Common/MetaTags'
import ZoraNft from '@components/Home/OpenActions/Zora/ZoraNft'
import { VideoDetailShimmer } from '@components/Shimmers/VideoDetailShimmer'
import { Button } from '@components/UIElements/Button'
import SuggestedVideos from '@components/Watch/SuggestedVideos'
import { t, Trans } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { FEATURED_ZORA_COLLECTS, WORKER_LIVE_URL } from '@tape.xyz/constants'
import { getOpenActionNftMetadata, getURLs } from '@tape.xyz/generic'
import type { BasicNftMetadata } from '@tape.xyz/lens/custom-types'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import Custom404 from 'src/pages/404'

import LiveVideo from './LiveVideo'
import Meta from './Meta'

const StreamDetails = () => {
  const {
    query: { slug }
  } = useRouter()

  const sectionRef = useRef<HTMLDivElement>(null)

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2
  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

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
          <div className="col-span-3">
            <div className="space-y-3.5">
              <LiveVideo
                thumbnailUrl={thumbnailUrl}
                playbackUrl={playbackUrl}
              />
              <Meta live={liveItem} channel={channel} />
              {!isLive && (
                <Alert>
                  <div className="flex w-full items-center justify-between">
                    <span className="font-semibold">
                      Oops! This stream has ended. But don't worry, there's
                      plenty more to explore!
                    </span>
                    <Link href="/">
                      <Button size="sm">Go Home</Button>
                    </Link>
                  </div>
                </Alert>
              )}
            </div>
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CollectOutline className="h-4 w-4" />
                  <h1 className="text-xl font-semibold">
                    <Trans>More Collects</Trans>
                  </h1>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => scroll(-scrollOffset)}
                    className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none"
                  >
                    <ChevronLeftOutline className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scroll(scrollOffset)}
                    className="rounded-full bg-gray-500 bg-opacity-10 p-2 backdrop-blur-xl hover:bg-opacity-25 focus:outline-none"
                  >
                    <ChevronRightOutline className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div
                ref={sectionRef}
                className="no-scrollbar relative mb-3 flex touch-pan-x items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth"
              >
                {FEATURED_ZORA_COLLECTS.map((url, i) => {
                  const urls = getURLs(url)
                  const nftMetadata = getOpenActionNftMetadata(
                    urls
                  ) as BasicNftMetadata
                  return <ZoraNft nftMetadata={nftMetadata} key={i} />
                })}
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
