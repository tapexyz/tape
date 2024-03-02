import { EVENTS, Tower } from '@dragverse/generic'
import type { NextPage } from 'next'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

import Feed from './Feed'
import TopSection from './TopSection'

const Home: NextPage = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.HOME })
  }, [])
  const { setTheme } = useTheme()
  setTheme('dark')

  return (
    <div className="max-w-screen-ultrawide container mx-auto">
      <TopSection />
      <Feed />
    </div>
  )
}

export default Home
