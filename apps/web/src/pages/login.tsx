import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Login = () => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LOGIN })
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <MetaTags title="Login" />
      <Link
        className="hidden w-1/2 bg-black dark:bg-white md:block"
        href="/"
        id="tape-cursor"
      >
        <div className="dark:text-bunker flex h-full flex-col items-center justify-center text-white dark:text-black">
          <div className="flex justify-center">
            {resolvedTheme === 'dark' ? (
              <img
                alt="tape"
                className="h-10"
                draggable={false}
                height={30}
                src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
                width={180}
              />
            ) : (
              <img
                alt="tape"
                className="h-10"
                draggable={false}
                height={30}
                src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
                width={180}
              />
            )}
          </div>
        </div>
      </Link>
      <div className="relative grid h-full w-full place-items-center md:w-1/2">
        <div className="container mx-auto max-w-sm space-y-3 text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p>Discover the new era of media sharing with Tape.</p>
          <Connectors />
        </div>
      </div>
    </div>
  )
}

export default Login
