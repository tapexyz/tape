import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { Button, IconButton } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'

import SearchOutline from './Icons/SearchOutline'
import UploadOutline from './Icons/UploadOutline'
import UserMenu from './UserMenu'

const Navbar = () => {
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const isActivePath = (path: string) => router.pathname === path
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <motion.div
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{ ease: 'linear' }}
      className="ultrawide:p-8 laptop:p-6 fixed z-10 w-full bg-white/70 p-4 backdrop-blur-2xl dark:bg-black/70"
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex w-1/5 items-center">
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
        <div className="flex space-x-7 pl-1">
          <Link
            href="/"
            className={clsx(
              isActivePath('/')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-30 hover:opacity-90'
            )}
          >
            <Trans>Home</Trans>
          </Link>
          <Link
            href="/feed"
            className={clsx(
              isActivePath('/feed')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-30 hover:opacity-90'
            )}
          >
            <Trans>Feed</Trans>
          </Link>
          <Link
            href="/bytes"
            className={clsx(
              isActivePath('/bytes')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-30 hover:opacity-90'
            )}
          >
            <Trans>Bytes</Trans>
          </Link>
        </div>
        <div className="flex w-1/5 items-center justify-end space-x-4">
          <IconButton radius="full" variant="soft">
            <SearchOutline className="h-3.5 w-3.5" />
          </IconButton>
          {selectedSimpleProfile?.id ? (
            <>
              <Link href="/upload">
                <Button highContrast>
                  <UploadOutline className="h-3.5 w-3.5" />
                  Create
                </Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link href="/login">
              <Button highContrast>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar
