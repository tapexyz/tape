import ChevronLeftOutline from '@components/Common/Icons/ChevronLeftOutline'
import ChevronRightOutline from '@components/Common/Icons/ChevronRightOutline'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import React, { useRef } from 'react'

import LatestBytes from './LatestBytes'
import WelcomeAlert from './WelcomeAlert'

const TopSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const sectionOffsetWidth = sectionRef.current?.offsetWidth ?? 1000
  const scrollOffset = sectionOffsetWidth / 1.2

  const scroll = (offset: number) => {
    if (sectionRef.current) {
      sectionRef.current.scrollLeft += offset
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xl">
          <h1 className="font-bold text-blue-500">
            <Trans>Today</Trans>
          </h1>
          <h1>
            <Trans>New & Trending</Trans>
          </h1>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => scroll(-scrollOffset)}
            className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-900"
          >
            <ChevronLeftOutline className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(scrollOffset)}
            className="rounded-full p-2 backdrop-blur-xl hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-900"
          >
            <ChevronRightOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="no-scrollbar ultrawide:pt-8 laptop:pt-6 relative flex touch-pan-x items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth pt-4">
        {!selectedSimpleProfile?.id && <WelcomeAlert />}
        <LatestBytes />
      </div>
    </div>
  )
}

export default TopSection
