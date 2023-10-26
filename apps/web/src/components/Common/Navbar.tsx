import useAuthPersistStore from '@lib/store/auth'
import usePersistStore from '@lib/store/persist'
import { Button, HoverCard, IconButton } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'

import Footer from './Footer'
import BellOutline from './Icons/BellOutline'
import ThreeDotsOutline from './Icons/ThreeDotsOutline'
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
  const {
    latestNotificationId,
    setLastOpenedNotificationId,
    lastOpenedNotificationId
  } = usePersistStore()

  return (
    <div className="ultrawide:px-8 laptop:px-6 dark:bg-bunker/80 sticky top-0 z-10 flex h-16 w-full items-center bg-white/80 px-4 backdrop-blur-2xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2 md:w-1/5">
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
          <HoverCard.Root>
            <HoverCard.Trigger>
              <IconButton
                variant="ghost"
                radius="large"
                className="opacity-40 hover:opacity-100"
              >
                <ThreeDotsOutline className="h-4 w-4" />
              </IconButton>
            </HoverCard.Trigger>
            <HoverCard.Content className="dark:bg-bunker w-72 bg-white">
              <Footer />
            </HoverCard.Content>
          </HoverCard.Root>
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
            Home
          </Link>
          <Link
            href="/feed"
            className={clsx(
              isActivePath('/feed')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-60 hover:opacity-90'
            )}
          >
            Feed
          </Link>
          <Link
            href="/bytes"
            className={clsx(
              isActivePath('/bytes')
                ? 'font-bold opacity-100'
                : 'font-medium opacity-60 hover:opacity-90'
            )}
          >
            Bytes
          </Link>
        </div>
        <div className="flex w-1/5 items-center justify-end space-x-3">
          <GlobalSearch />
          {selectedSimpleProfile?.id ? (
            <>
              <Link
                onClick={() => {
                  if (latestNotificationId) {
                    setLastOpenedNotificationId(latestNotificationId)
                  }
                }}
                href="/notifications"
                className="relative hidden md:block"
              >
                <IconButton radius="full" highContrast size="3" variant="soft">
                  <BellOutline className="h-4 w-4" />
                </IconButton>
                {lastOpenedNotificationId !== latestNotificationId ? (
                  <span className="absolute right-1 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </Link>
              <Link href="/create" className="hidden md:block">
                <Button highContrast size="3">
                  <UploadOutline className="h-4 w-4" />
                  Create
                </Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link href={`/login?next=${asPath}`}>
              <Button size="3" highContrast>
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
