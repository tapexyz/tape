import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { Button, IconButton } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'

import BellOutline from './Icons/BellOutline'
import UploadOutline from './Icons/UploadOutline'
import GlobalSearch from './Search/GlobalSearch'
import UserMenu from './UserMenu'

const Navbar = () => {
  const { pathname, asPath } = useRouter()
  const { resolvedTheme } = useTheme()

  const isActivePath = (path: string) => pathname === path
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  return (
    <div className="ultrawide:px-8 laptop:px-6 dark:bg-bunker/70 fixed z-10 flex h-16 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] items-center bg-white/50 px-4 backdrop-blur-2xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center md:w-1/5">
          <Link href="/" className="inline-flex">
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
        </div>
        <div className="hidden space-x-7 md:flex">
          <Link
            href="/"
            className={clsx(
              isActivePath('/')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-60 hover:opacity-90'
            )}
          >
            <Trans>Home</Trans>
          </Link>
          <Link
            href="/feed"
            className={clsx(
              isActivePath('/feed')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-60 hover:opacity-90'
            )}
          >
            <Trans>Feed</Trans>
          </Link>
          <Link
            href="/bytes"
            className={clsx(
              isActivePath('/bytes')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-60 hover:opacity-90'
            )}
          >
            <Trans>Bytes</Trans>
          </Link>
        </div>
        <div className="flex w-1/5 items-center justify-end space-x-3">
          <GlobalSearch />
          {selectedSimpleProfile?.id ? (
            <>
              <Link href="/notifications" className="hidden md:block">
                <IconButton radius="full" highContrast variant="soft">
                  <BellOutline className="h-3.5 w-3.5" />
                </IconButton>
              </Link>
              <Link href="/create" className="hidden md:block">
                <Button highContrast>
                  <UploadOutline className="h-3.5 w-3.5" />
                  Create
                </Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link href={`/login?next=${asPath}`}>
              <Button highContrast>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
