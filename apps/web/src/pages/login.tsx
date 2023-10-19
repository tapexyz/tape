import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import SignalWaveGraphic from '@components/UIElements/SignalWaveGraphic'
import Link from 'next/link'
import React from 'react'

const login = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <MetaTags title="Login" />
      <Link
        href="/"
        id="tape-cursor"
        className="relative hidden w-1/2 bg-black dark:bg-white md:block"
      >
        <SignalWaveGraphic />
        <div className="dark:text-bunker flex h-full flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">〖 TAPE 〗</h1>
        </div>
      </Link>
      <div className="relative grid h-full w-full place-items-center md:w-1/2">
        <div className="container mx-auto max-w-md space-y-3 text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p>Discover a new era of content sharing with Tape.</p>
          <Connectors />
        </div>
      </div>
    </div>
  )
}

export default login
