import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React from 'react'

const Login = () => {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <MetaTags title="Login" />
      <Link
        href="/"
        id="tape-cursor"
        className="hidden w-1/2 bg-black dark:bg-white md:block"
      >
        <div className="dark:text-bunker flex h-full flex-col items-center justify-center text-white dark:text-black">
          <div className="flex justify-center">
            {resolvedTheme === 'dark' ? (
              <img
                src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
                className="-mb-0.5 h-9"
                alt="tape"
                height={30}
                draggable={false}
              />
            ) : (
              <img
                src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
                className="-mb-0.5 h-9"
                alt="tape"
                height={30}
                draggable={false}
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
