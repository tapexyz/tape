import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import BellOutline from './Icons/BellOutline'
import BytesOutline from './Icons/BytesOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import PlusOutline from './Icons/PlusOutline'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-10 border-t-[0.5px] border-gray-300 bg-white/90 backdrop-blur-xl dark:border-gray-700 dark:bg-black/90 md:hidden">
      <div className="grid grid-cols-5 py-3">
        <Link
          href="/"
          className={clsx(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <HomeOutline className="size-6" />
          <span className="sr-only">Home</span>
        </Link>
        <Link
          href="/bytes"
          className={clsx(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/bytes') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <BytesOutline className="size-6" />
          <span className="sr-only">Bytes</span>
        </Link>
        <Link
          href="/create"
          className={clsx(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/create') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <PlusOutline className="size-7" />
          <span className="sr-only">Create</span>
        </Link>
        <Link
          href="/notifications"
          className={clsx(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/explore') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <BellOutline className="size-6" />
          <span className="sr-only">Explore</span>
        </Link>
        <Link
          href="/feed"
          className={clsx(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid',
            isActivePath('/feed') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <FeedOutline className="size-6" />
          <span className="sr-only">Feed</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
