import MetaTags from '@components/Common/MetaTags'
import Connectors from '@components/Login/Connectors'
import { TAPE_LOGO } from '@dragverse/constants'
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
        className="bg-brand-850 hidden w-1/2 dark:bg-brand-100 md:block"
      >
        <div className="dark:text-bunker flex h-full flex-col items-center justify-center text-white dark:text-black">
          <div className="flex justify-center">
            {resolvedTheme === 'dark' ? (
              <img
                src={`${TAPE_LOGO}`}
                className="h-50"
                alt="dragverse"
                width={180}
                height={30}
                draggable={false}
              />
            ) : (
              <img
                src={`${TAPE_LOGO}`}
                className="h-50"
                alt="dragverse"
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
          <h2 className="text-2xl font-bold">You are about to enter the Dragverse✨</h2>
          <p>
            Connect your 👛 wallet and login with your Lens account 🗝 to interact with the social network, collect posts, and more! 
          </p>
          <Connectors />
        </div>
      </div>
    </div>
  )
}

export default Login
