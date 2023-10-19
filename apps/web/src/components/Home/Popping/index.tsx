import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import ExploreOutline from '@components/Common/Icons/ExploreOutline'
import { Trans } from '@lingui/macro'
import { FEATURED_ZORA_COLLECTS } from '@tape.xyz/constants'
import { getOpenActionNftMetadata, getURLs } from '@tape.xyz/generic'
import type { BasicNftMetadata } from '@tape.xyz/lens/custom-types'
import React, { useRef } from 'react'

import ZoraNft from '../FEOpenActions/Zora/ZoraNft'
import UnlonelyStreams from './UnlonelyStreams'

const WhatsPopping = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2
  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ExploreOutline className="h-4 w-4" />
          <h1 className="text-xl font-bold">
            <Trans>What's Popping?</Trans>
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
        <UnlonelyStreams />
        {FEATURED_ZORA_COLLECTS.map((url, i) => {
          const urls = getURLs(url)
          const nftMetadata = getOpenActionNftMetadata(urls) as BasicNftMetadata
          return <ZoraNft nftMetadata={nftMetadata} key={i} />
        })}
      </div>
      <hr className="border-theme my-8 border-opacity-10 dark:border-gray-700" />
    </div>
  )
}

export default WhatsPopping
