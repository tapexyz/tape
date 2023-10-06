import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import ExploreOutline from '@components/Common/Icons/ExploreOutline'
import { Trans } from '@lingui/macro'
import { getOpenActionNftMetadata, getURLs } from '@tape.xyz/generic'
import type { BasicNftMetadata } from '@tape.xyz/lens/custom-types'
import React, { useRef } from 'react'

import ZoraNft from '../OpenActions/Zora/ZoraNft'
import UnlonelyStreams from './UnlonelyStreams'

const FEATURED_ZORA = [
  'https://zora.co/collect/zora:0x4e18d1be29f54d6c11935939e36c9988897c145e',
  'https://zora.co/collect/eth:0x0bc2a24ce568dad89691116d5b34deb6c203f342/193',
  'https://zora.co/collect/eth:0x7ad18982781ae3d68d1c964f61b872fb2f899021',
  'https://zora.co/collect/zora:0xc8b408c889baeed2704168de3b3b8795158ca187',
  'https://zora.co/collect/zora:0xab821ed94191628354078bcbb206512914eb42e1'
]

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
          <h1 className="text-xl font-semibold">
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
        {FEATURED_ZORA.map((url, i) => {
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
