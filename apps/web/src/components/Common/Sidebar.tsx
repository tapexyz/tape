import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { STATIC_ASSETS } from 'utils'
import { FEATURE_FLAGS } from 'utils/data/feature-flags'
import getIsFeatureEnabled from 'utils/functions/getIsFeatureEnabled'
import { getShowFullScreen } from 'utils/functions/getShowFullScreen'

import Footer from './Footer'
import BytesOutline from './Icons/BytesOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import MusicOutline from './Icons/MusicOutline'
import MobileBottomNav from './MobileBottomNav'

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

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
          'fixed top-0 bottom-0 transition-width left-0 z-10 items-start justify-between hidden bg-white dark:bg-theme md:flex md:flex-col',
          sidebarCollapsed ? 'w-[90px]' : 'w-[180px]'
        )}
      >
        <div
          className={clsx(
            'flex flex-col space-y-2',
            sidebarCollapsed ? 'self-center' : 'px-[18px] w-full'
          )}
        >
          <div className={clsx('py-3', sidebarCollapsed ? 'px-3' : 'px-3.5')}>
            <Link
              href="/"
              className="flex items-center pt-1 focus:outline-none"
            >
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
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
                href="/"
                className={clsx(
                  'py-2 2xl:py-2.5 flex h-12 items-center group rounded-full',
                  isActivePath('/')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
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
                href="/feed"
                className={clsx(
                  'py-2 2xl:py-2.5 flex h-12 items-center group rounded-full',
                  isActivePath('/feed')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <FeedOutline className="w-5 h-5 flex-none" />
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
                href="/bytes"
                className={clsx(
                  'py-2 2xl:py-2.5 flex h-12 items-center group rounded-full',
                  isActivePath('/bytes') || router.pathname === '/bytes/[id]'
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
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
                href="/explore"
                className={clsx(
                  'py-2 2xl:py-2.5 flex h-12 items-center group rounded-full',
                  isActivePath('/explore')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full px-4 space-x-3'
                )}
              >
                <ExploreOutline className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm">Explore</span>}
              </Link>
            </Tooltip>
            {getIsFeatureEnabled(
              FEATURE_FLAGS.LENSTUBE_ECHOS,
              selectedChannelId
            ) && (
              <Tooltip
                content="Echos"
                placement="right"
                visible={sidebarCollapsed}
              >
                <Link
                  href="/echo"
                  className={clsx(
                    'py-2 2xl:py-2.5 flex h-12 items-center group rounded-full',
                    isActivePath('/echo')
                      ? 'bg-indigo-50 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                    sidebarCollapsed
                      ? 'w-12 justify-center'
                      : 'w-full px-4 space-x-3'
                  )}
                >
                  <MusicOutline className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="text-sm">Echo</span>}
                </Link>
              </Tooltip>
            )}
          </div>
        </div>
        <div
          className={clsx(
            'flex flex-col mb-1',
            sidebarCollapsed ? 'mx-auto' : 'px-3'
          )}
        >
          {!sidebarCollapsed && <Footer />}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            type="button"
            className={clsx(
              'flex p-3.5 mt-2 items-center h-12 justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none opacity-90 hover:opacity-100',
              sidebarCollapsed ? 'w-12' : 'w-full'
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
