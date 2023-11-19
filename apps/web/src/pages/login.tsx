import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import { STATIC_ASSETS } from '@dragverse/constants'
import { EVENTS, Tower } from '@dragverse/generic'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

const Login = () => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.LOGIN })
  }, [])

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
                className="h-10"
                alt="tape"
                width={180}
                height={30}
                draggable={false}
              />
            ) : (
              <img
                src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
                className="h-10"
                alt="tape"
                width={180}
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
