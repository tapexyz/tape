import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import { getShowFullScreen } from '@utils/functions/getShowFullScreen'
import { BYTES, EXPLORE, FEED, HOME } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Footer from './Footer'
import BytesOutline from './Icons/BytesOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import MobileBottomNav from './MobileBottomNav'

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  const isActivePath = (path: string) => router.pathname === path

  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <CreateChannel />
      <div
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-10 items-start justify-between hidden bg-white dark:bg-theme md:flex md:flex-col',
          sidebarCollapsed ? 'w-[90px]' : 'w-[170px]'
        )}
      >
        <div
          className={clsx(
            'flex flex-col space-y-2',
            sidebarCollapsed ? 'self-center' : 'px-3 w-full'
          )}
        >
          <div className="p-3">
            <Link
              href={HOME}
              className="flex items-center pt-1 focus:outline-none"
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
            <Tooltip
              content="Home"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href={HOME}
                className={clsx(
                  'py-2 2xl:py-2.5 flex items-center group rounded-full',
                  isActivePath(HOME)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 h-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <HomeOutline className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm">Home</span>}
              </Link>
            </Tooltip>
            <Tooltip
              content="Subscriptions"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href={FEED}
                className={clsx(
                  'py-2 2xl:py-2.5 flex items-center group rounded-full',
                  isActivePath(FEED)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 h-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <FeedOutline className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">Subscriptions</span>
                )}
              </Link>
            </Tooltip>
            <Tooltip
              content="Bytes"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href={BYTES}
                className={clsx(
                  'py-2 2xl:py-2.5 flex items-center group rounded-full',
                  isActivePath(BYTES) || router.pathname === '/bytes/[id]'
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 h-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <BytesOutline className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm">Bytes</span>}
              </Link>
            </Tooltip>
            <Tooltip
              content="Explore"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href={EXPLORE}
                className={clsx(
                  'py-2 2xl:py-2.5 flex items-center group rounded-full',
                  isActivePath(EXPLORE)
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 h-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <ExploreOutline className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm">Explore</span>}
              </Link>
            </Tooltip>
          </div>
        </div>
        <div
          className={clsx(
            'flex flex-col mb-4',
            sidebarCollapsed ? 'mx-auto' : 'px-3'
          )}
        >
          {!sidebarCollapsed && <Footer />}
          <button
            onClick={() => {
              Analytics.track(TRACK.SYSTEM.MORE_MENU.OPEN)
              setSidebarCollapsed(!sidebarCollapsed)
            }}
            type="button"
            className={clsx(
              'flex p-3.5 mt-2 items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none opacity-90 hover:opacity-100',
              sidebarCollapsed ? 'h-12 w-12' : 'w-full'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRightOutline className="w-3 h-3" />
            ) : (
              <ChevronLeftOutline className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
