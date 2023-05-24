import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'

import BytesOutline from './Icons/BytesOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import PlusOutline from './Icons/PlusOutline'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="pb-safe bg-theme fixed inset-x-0 bottom-0 z-[4] border-t border-gray-300 bg-white dark:border-gray-700 md:hidden">
      <div className="grid grid-cols-5">
        <Link
          href="/"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <HomeOutline
            className={clsx('h-4 w-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/')
            })}
          />
          <span className="text-[9px]">
            <Trans>Home</Trans>
          </span>
        </Link>
        <Link
          href="/bytes"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <BytesOutline
            className={clsx('h-4 w-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/bytes')
            })}
          />
          <span className="text-[9px]">
            <Trans>Bytes</Trans>
          </span>
        </Link>
        <Link
          href="/upload"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <PlusOutline className="h-8 w-8 opacity-80" />
        </Link>
        <Link
          href="/explore"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <ExploreOutline
            className={clsx('h-4 w-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/explore')
            })}
          />
          <span className="text-[9px]">
            <Trans>Explore</Trans>
          </span>
        </Link>
        <Link
          href="/feed"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <FeedOutline
            className={clsx('h-4 w-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/feed')
            })}
          />
          <span className="text-[9px]">
            <Trans>Feed</Trans>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
