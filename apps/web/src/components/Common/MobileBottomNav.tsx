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
    <div className="fixed inset-x-0 bottom-0 z-[4] md:hidden">
      <div
        className={clsx(
          'grid grid-cols-5 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-theme space-between'
        )}
      >
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid"
        >
          <HomeOutline
            className={clsx('w-4 h-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/')
            })}
          />
          <span className="text-[9px]">Home</span>
        </Link>
        <Link
          href="/bytes"
          className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid"
        >
          <BytesOutline
            className={clsx('w-4 h-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/bytes')
            })}
          />
          <span className="text-[9px]">Bytes</span>
        </Link>
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center w-full text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid"
        >
          <PlusOutline className="w-8 h-8 opacity-80" />
        </Link>
        <Link
          href="/explore"
          className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid"
        >
          <ExploreOutline
            className={clsx('w-4 h-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/explore')
            })}
          />
          <span className="text-[9px]">Explore</span>
        </Link>
        <Link
          href="/feed"
          className="flex flex-col items-center justify-center w-full pt-2 text-sm font-medium text-gray-700 transition-all duration-150 bg-transparent rounded-lg dark:hover:text-gray-100 dark:text-gray-100 md:grid"
        >
          <FeedOutline
            className={clsx('w-4 h-4 opacity-80', {
              'text-indigo-500 opacity-100': isActivePath('/feed')
            })}
          />
          <span className="text-[9px]">Feed</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
