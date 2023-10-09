import useAuthPersistStore from '@lib/store/auth'
import { Separator } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'

import BytesOutline from './Icons/BytesOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import UserMenu from './UserMenu'

const FloatingNav = () => {
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const isActivePath = (path: string) => router.pathname === path

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="tape-border fixed bottom-7 z-10 rounded-full bg-white px-5 py-3.5 backdrop-blur-3xl dark:bg-[#ffffff10]"
      >
        <div className="flex items-center space-x-4">
          <Link href="/">
            {resolvedTheme === 'dark' ? (
              <img
                src={`${STATIC_ASSETS}/brand/light-logo-text.png`}
                className="-mb-1 h-6"
                alt="tape"
              />
            ) : (
              <img
                src={`${STATIC_ASSETS}/brand/dark-logo-text.png`}
                className="-mb-1 h-6"
                alt="tape"
              />
            )}
          </Link>
          <Separator orientation="vertical" />
          <div className="flex space-x-7 pl-1">
            <Link
              href="/"
              className={clsx(
                isActivePath('/')
                  ? 'opacity-100'
                  : 'opacity-30 hover:opacity-90'
              )}
            >
              <HomeOutline className="h-5 w-5 flex-none" />
            </Link>
            <Link
              href="/feed"
              className={clsx(
                isActivePath('/feed')
                  ? 'opacity-100'
                  : 'opacity-30 hover:opacity-90'
              )}
            >
              <FeedOutline className="h-5 w-5 flex-none" />
            </Link>
            <Link
              href="/bytes"
              className={clsx(
                isActivePath('/bytes')
                  ? 'opacity-100'
                  : 'opacity-30 hover:opacity-90'
              )}
            >
              <BytesOutline className="h-5 w-5" />
            </Link>
          </div>
          {selectedSimpleProfile?.id && (
            <>
              <Separator orientation="vertical" />
              <UserMenu />
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default FloatingNav
