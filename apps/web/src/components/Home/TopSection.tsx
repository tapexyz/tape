import HorizantalScroller from '@components/Common/HorizantalScroller'
import useProfileStore from '@lib/store/profile'
import React, { useRef } from 'react'

import GitcoinAlert from './GitcoinAlert'
import LatestBytes from './LatestBytes'
import LensManagerAlert from './LensManagerAlert'
import WelcomeAlert from './WelcomeAlert'

const TopSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { activeProfile } = useProfileStore()

  return (
    <div className="flex flex-col">
      <HorizantalScroller
        sectionRef={sectionRef}
        heading="Hot Tea🔥"
        subheading="New & Trending"
      />
      <div
        ref={sectionRef}
        className="no-scrollbar laptop:pt-6 relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth pt-4"
      >
        {!activeProfile?.id && <WelcomeAlert />}
        <GitcoinAlert />
        <LensManagerAlert />
        <LatestBytes />
      </div>
    </div>
  )
}

export default TopSection
