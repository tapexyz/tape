import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import React from 'react'

const login = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      <MetaTags title="Login" />
      <div id="tape-cursor" className="hidden w-1/2 p-8 md:block">
        <div
          style={{
            backgroundImage: `url("${STATIC_ASSETS}/brand/login-bg.svg")`
          }}
          className="flex h-full flex-col items-center justify-center bg-contain bg-repeat-space text-white"
        >
          <h1 className="text-2xl font-bold">〖tape〗</h1>
        </div>
      </div>
      <div className="relative grid h-full w-full place-items-center bg-white text-black md:w-1/2">
        <div className="container mx-auto max-w-md space-y-3 text-center">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p>Discover a new era of content sharing with Tape.</p>
          <Connectors />
        </div>
      </div>
    </div>
  )
}

export default login
