import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import CollectOutline from '@components/Common/Icons/CollectOutline'
import MetaTags from '@components/Common/MetaTags'
import ZoraNft from '@components/Home/FEOpenActions/Zora/ZoraNft'
import SuggestedVideos from '@components/Watch/SuggestedVideos'
import { t, Trans } from '@lingui/macro'
import { FEATURED_ZORA_COLLECTS } from '@tape.xyz/constants'
import { getOpenActionNftMetadata, getURLs } from '@tape.xyz/generic'
import type { BasicNftMetadata } from '@tape.xyz/lens/custom-types'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

import Unlonely from './channels/Unlonely'

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

  return (
    <>
      <MetaTags title={t`Live`} />
      <div className="grid grid-cols-1 gap-y-4 md:gap-4 xl:grid-cols-4">
        <div className="col-span-3">
          <Unlonely channel={channel} />
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CollectOutline className="h-4 w-4" />
                <h1 className="text-xl font-semibold">
                  <Trans>From the frens</Trans>
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
    </>
  )
}

export default StreamDetails
