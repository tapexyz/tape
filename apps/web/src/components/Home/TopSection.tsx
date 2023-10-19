import HorizantalScroller from '@components/Common/HorizantalScroller'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import React, { useRef } from 'react'

import DispatcherAlert from './DispatcherAlert'
import GitcoinAlert from './GitcoinAlert'
import LatestBytes from './LatestBytes'
import WelcomeAlert from './WelcomeAlert'

const TopSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <div className="flex flex-col">
      <HorizantalScroller
        sectionRef={sectionRef}
        heading={t`Today`}
        subheading={t`New & Trending`}
      />
      <div
        ref={sectionRef}
        className="no-scrollbar ultrawide:pt-8 laptop:pt-6 relative flex items-start space-x-4 overflow-x-auto overflow-y-hidden scroll-smooth pt-4"
      >
        {!selectedSimpleProfile?.id && <WelcomeAlert />}
        <GitcoinAlert />
        <DispatcherAlert />
        <LatestBytes />
      </div>
    </div>
  )
}

export default TopSection
