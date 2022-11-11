import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@utils/analytics'
import { getShowFullScreen } from '@utils/functions/getShowFullScreen'
import { BYTES, EXPLORE, FEED, HOME } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import BytesOutline from './Icons/BytesOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import MobileBottomNav from './MobileBottomNav'

const CreateChannel = dynamic(() => import('./CreateChannel'))
const MoreTrigger = dynamic(() => import('../../components/Common/MoreTrigger'))

const Sidebar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const isActivePath = (path: string) => router.pathname === path

  const onToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    Analytics.track(
      theme === 'dark' ? TRACK.SYSTEM.THEME.DARK : TRACK.SYSTEM.THEME.LIGHT
    )
  }

  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <CreateChannel />
      <div className="fixed top-0 bottom-0 left-0 z-10 items-start justify-between hidden w-[90px] bg-white dark:bg-[#151a2c] md:flex md:flex-col">
        <div className="flex flex-col self-center text-center space-y-2">
          <div className="p-3">
            <Link
              href={HOME}
              className="flex items-center justify-center pt-1 focus:outline-none"
            >
              <img
                src="/lenstube.svg"
                draggable={false}
                className="w-6 h-6 ml-0.5"
                alt="lenstube"
              />
            </Link>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <Tooltip content="Home" placement="right">
              <Link
                href={HOME}
                className={clsx(
                  'py-2 2xl:py-2.5 flex justify-center items-center group rounded-full w-12 h-12',
                  isActivePath(HOME)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <HomeOutline className="w-5 h-5" />
              </Link>
            </Tooltip>
            <Tooltip content="Subscriptions" placement="right">
              <Link
                href={FEED}
                className={clsx(
                  'py-2 2xl:py-2.5 flex justify-center items-center group rounded-full w-12 h-12',
                  isActivePath(FEED)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <FeedOutline className="w-5 h-5" />
              </Link>
            </Tooltip>
            <Tooltip content="Bytes" placement="right">
              <Link
                href={BYTES}
                className={clsx(
                  'py-2 2xl:py-2.5 flex justify-center items-center group rounded-full w-12 h-12',
                  isActivePath(BYTES) || router.pathname === '/bytes/[id]'
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <BytesOutline className="w-5 h-5" />
              </Link>
            </Tooltip>
            <Tooltip content="Explore" placement="right">
              <Link
                href={EXPLORE}
                className={clsx(
                  'py-2 2xl:py-2.5 flex justify-center items-center group rounded-full w-12 h-12',
                  isActivePath(EXPLORE)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <ExploreOutline className="w-5 h-5" />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col self-center mx-auto mb-4">
          <MoreTrigger />
        </div>
      </div>
    </>
  )
}

export default Sidebar
