import { Analytics, TRACK } from '@utils/analytics'
import { getShowFullScreen } from '@utils/functions/getShowFullScreen'
import { BYTES, EXPLORE, FEED, HOME, LIBRARY } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { BiMoon, BiSun } from 'react-icons/bi'
import { FiHome } from 'react-icons/fi'
import {
  MdOutlineSubscriptions,
  MdOutlineVideoLibrary,
  MdSlowMotionVideo
} from 'react-icons/md'
import { RiLeafLine } from 'react-icons/ri'

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
      <div className="fixed top-0 bottom-0 left-0 z-10 items-start justify-between hidden w-[68px] p-1 m-2 bg-white border shadow dark:border-gray-900 rounded-xl dark:bg-black md:flex md:flex-col">
        <div className="flex flex-col w-full text-center space-y-1.5">
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
          <div className="flex flex-col w-full space-y-1">
            <Link
              href={HOME}
              className={clsx(
                'rounded-lg py-2 2xl:py-2.5 group',
                isActivePath(HOME)
                  ? 'bg-indigo-50 dark:bg-[#181818]'
                  : 'hover:bg-gray-50 dark:hover:bg-[#181818]'
              )}
            >
              <div className="flex flex-col pt-0.5 items-center space-y-1 group-hover:opacity-100 opacity-80">
                <FiHome className="text-xl" />
                <p className="text-[11px] font-medium">Home</p>
              </div>
            </Link>
            <Link
              href={FEED}
              className={clsx(
                'rounded-lg py-2 2xl:py-2.5 group',
                isActivePath(FEED)
                  ? 'bg-indigo-50 dark:bg-[#181818]'
                  : 'hover:bg-gray-50 dark:hover:bg-[#181818]'
              )}
            >
              <div className="flex flex-col pt-0.5 items-center space-y-1 group-hover:opacity-100 opacity-80">
                <MdOutlineSubscriptions className="text-xl" />
                <p className="text-[11px] font-medium">Feed</p>
              </div>
            </Link>
            <Link
              href={EXPLORE}
              className={clsx(
                'rounded-lg py-2 2xl:py-2.5 group',
                isActivePath(EXPLORE)
                  ? 'bg-indigo-50 dark:bg-[#181818]'
                  : 'hover:bg-gray-50 dark:hover:bg-[#181818]'
              )}
            >
              <div className="flex flex-col pt-0.5 items-center space-y-1 group-hover:opacity-100 opacity-80">
                <RiLeafLine className="text-xl" />
                <p className="text-[11px] font-medium">Explore</p>
              </div>
            </Link>
            <Link
              href={BYTES}
              className={clsx('rounded-lg py-2 2xl:py-2.5 group', {
                'bg-indigo-50 dark:bg-[#181818]':
                  isActivePath(BYTES) || router.pathname === '/bytes/[id]',
                'hover:bg-gray-50 dark:hover:bg-[#181818]':
                  !isActivePath(BYTES) && router.pathname !== '/bytes/[id]'
              })}
            >
              <div className="flex flex-col pt-0.5 items-center space-y-1 group-hover:opacity-100 opacity-80">
                <MdSlowMotionVideo className="text-xl" />
                <p className="text-[11px] font-medium">Bytes</p>
              </div>
            </Link>
            <Link
              href={LIBRARY}
              className={clsx(
                'rounded-lg py-2 2xl:py-2.5 group',
                isActivePath(LIBRARY)
                  ? 'bg-indigo-50 dark:bg-[#181818]'
                  : 'hover:bg-gray-50 dark:hover:bg-[#181818]'
              )}
            >
              <div className="flex flex-col items-center pt-0.5 space-y-1 group-hover:opacity-100 opacity-80">
                <MdOutlineVideoLibrary className="text-xl" />
                <p className="text-[11px] font-medium">Library</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <button
            type="button"
            onClick={() => onToggleTheme()}
            className="flex p-3 py-4 justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-[#181818] focus:outline-none opacity-90 hover:opacity-100"
          >
            {theme === 'light' ? <BiMoon /> : <BiSun />}
          </button>
          <MoreTrigger />
        </div>
      </div>
    </>
  )
}

export default Sidebar
