import Tooltip from '@components/UIElements/Tooltip'
import { getShowFullScreen } from '@lenstube/browser'
import { STATIC_ASSETS } from '@lenstube/constants'
import { t } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import BytesOutline from './Icons/BytesOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import Locale from './Locale'
import MobileBottomNav from './MobileBottomNav'

const Sidebar = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <div className="fixed bottom-0 left-0 top-0 z-20 hidden w-[90px] items-start justify-between bg-white shadow-md dark:bg-black md:flex md:flex-col">
        <div
          className="flex flex-col space-y-2 self-center"
          data-testid="sidebar-items"
        >
          <div className="px-2 py-3">
            <Link
              href="/"
              className="flex items-center pt-0.5 focus:outline-none"
            >
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
                draggable={false}
                className="h-8 w-8"
                alt="lenstube"
              />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <Tooltip content={t`Home`} placement="right">
              <Link
                href="/"
                className={clsx(
                  'group flex h-12 w-12 items-center justify-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/')
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <HomeOutline className="h-5 w-5" />
              </Link>
            </Tooltip>
            <Tooltip content={t`Feed`} placement="right">
              <Link
                href="/feed"
                className={clsx(
                  'group flex h-12 w-12 items-center justify-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/feed')
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <FeedOutline className="h-5 w-5 flex-none" />
              </Link>
            </Tooltip>
            <Tooltip content={t`Bytes`} placement="right">
              <Link
                href="/bytes"
                className={clsx(
                  'group flex h-12 w-12 items-center justify-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/bytes') || router.pathname === '/bytes/[id]'
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <BytesOutline className="h-5 w-5" />
              </Link>
            </Tooltip>
            <Tooltip content={t`Explore`} placement="right">
              <Link
                href="/explore"
                className={clsx(
                  'group flex h-12 w-12 items-center justify-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/explore')
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <ExploreOutline className="h-5 w-5" />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="mx-auto mb-2 flex flex-col">
          <Locale />
        </div>
      </div>
    </>
  )
}

export default Sidebar
