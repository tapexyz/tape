import { EVENTS, Tower } from '@tape.xyz/generic'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'

import Feed from './Feed'
import TopSection from './TopSection'

const Home: NextPage = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.HOME })
  }, [])

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <TopSection />
      <Feed />
    </div>
  )
}

export default Home
