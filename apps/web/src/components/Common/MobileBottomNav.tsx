import { tw } from '@tape.xyz/browser'
import {
  BellOutline,
  BytesOutline,
  FeedOutline,
  HomeOutline,
  PlusOutline
} from '@tape.xyz/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const MobileBottomNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="pb-safe absolute inset-x-0 bottom-0 z-10 border-t-[0.5px] border-gray-300 bg-white/90 backdrop-blur-xl md:hidden dark:border-gray-700 dark:bg-black/90">
      <div className="grid grid-cols-5 py-3">
        <Link
          href="/"
          className={tw(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 md:grid dark:text-gray-100 dark:hover:text-gray-100',
            isActivePath('/') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <HomeOutline className="size-6" />
          <span className="sr-only">Home</span>
        </Link>
        <Link
          href="/bytes"
          className={tw(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 md:grid dark:text-gray-100 dark:hover:text-gray-100',
            isActivePath('/bytes') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <BytesOutline className="size-6" />
          <span className="sr-only">Bytes</span>
        </Link>
        <Link
          href="/create"
          className={tw(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 md:grid dark:text-gray-100 dark:hover:text-gray-100',
            isActivePath('/create') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <PlusOutline className="size-7" />
          <span className="sr-only">Create</span>
        </Link>
        <Link
          href="/notifications"
          className={tw(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 md:grid dark:text-gray-100 dark:hover:text-gray-100',
            isActivePath('/explore') ? 'opacity-100' : 'opacity-70'
          )}
        >
          <BellOutline className="size-6" />
          <span className="sr-only">Explore</span>
        </Link>
        <Link
          href="/feed"
          className={tw(
            'flex w-full flex-col items-center justify-center bg-transparent text-sm font-medium text-gray-700 md:grid dark:text-gray-100 dark:hover:text-gray-100',
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
