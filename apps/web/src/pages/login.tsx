import MetaTags from '@components/Common/MetaTags'
import CardBorders from '@components/Login/CardBorders'
import Connectors from '@components/Login/Connectors'
import { EVENTS, Tower } from '@tape.xyz/generic'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

const BackgroundComets = dynamic(
  () => import('@components/Login/BackgroundComets')
)

const Login = () => {
  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LOGIN })
  }, [])

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#FAFAFA] dark:bg-black">
      <MetaTags title="Login" />
      <div className="grid h-full w-full place-items-center">
        <div className="tape-border container relative z-10 mx-auto max-w-md bg-white bg-opacity-50 p-10 backdrop-blur-[2px] dark:bg-inherit">
          <CardBorders />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p>Discover the new era of media sharing with Tape.</p>
          <Connectors />
        </div>
        <BackgroundComets />
      </div>
    </div>
  )
}

export default Login
