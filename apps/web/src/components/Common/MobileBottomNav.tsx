import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import BytesOutline from './Icons/BytesOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import PlusOutline from './Icons/PlusOutline'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="pb-safe dark:bg-theme/90 fixed inset-x-0 bottom-0 z-[4] border-t-[0.5px] border-gray-300 bg-white/90 backdrop-blur-xl dark:border-gray-700 md:hidden">
      <div className="grid grid-cols-5 py-2.5">
        <Link
          href="/"
          className={clsx(
            'flex w-full flex-col items-center justify-center space-y-1 rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <HomeOutline className="h-4 w-4" />
          <span className="text-xs">
            <Trans>Home</Trans>
          </span>
        </Link>
        <Link
          href="/bytes"
          className={clsx(
            'flex w-full flex-col items-center justify-center space-y-1 rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/bytes') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <BytesOutline className="h-4 w-4" />
          <span className="text-xs">
            <Trans>Bytes</Trans>
          </span>
        </Link>
        <Link
          href="/upload"
          className={clsx(
            'flex w-full flex-col items-center justify-center space-y-1 rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid'
          )}
        >
          <PlusOutline className="h-8 w-8" />
        </Link>
        <Link
          href="/explore"
          className={clsx(
            'flex w-full flex-col items-center justify-center space-y-1 rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/explore') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <ExploreOutline className="h-4 w-4" />
          <span className="text-xs">
            <Trans>Explore</Trans>
          </span>
        </Link>
        <Link
          href="/feed"
          className={clsx(
            'flex w-full flex-col items-center justify-center space-y-1 rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/feed') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <FeedOutline className="h-4 w-4" />
          <span className="text-xs">
            <Trans>Feed</Trans>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
