import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { Button, DropdownMenu, IconButton } from '@radix-ui/themes'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React from 'react'

import BellOutline from './Icons/BellOutline'
import ChevronDownOutline from './Icons/ChevronDownOutline'
import UploadOutline from './Icons/UploadOutline'
import GlobalSearch from './Search/GlobalSearch'
import TapeMenu from './TapeMenu'
import UserMenu from './UserMenu'

const Navbar = () => {
  const { pathname, asPath } = useRouter()
  const { resolvedTheme } = useTheme()

  const isActivePath = (path: string) => pathname === path
  const { activeProfile } = useProfileStore()
  const {
    latestNotificationId,
    setLastOpenedNotificationId,
    lastOpenedNotificationId
  } = usePersistStore()

  return (
    <div className="ultrawide:px-8 laptop:px-6 sticky top-0 z-10 flex h-14 w-full items-center bg-white/80 px-4 backdrop-blur-2xl dark:bg-black/80">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2 md:w-1/5">
          <Link href="/" className="inline-flex">
            {resolvedTheme === 'dark' ? (
              <img
                src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
                className="-mb-0.5 h-6"
                alt="tape"
                height={30}
                width={110}
                draggable={false}
              />
            ) : (
              <img
                src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
                className="-mb-0.5 h-6"
                height={30}
                width={110}
                alt="tape"
                draggable={false}
              />
            )}
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                variant="ghost"
                radius="full"
                className="opacity-50 hover:opacity-100"
              >
                <ChevronDownOutline className="h-3 w-3" />
                <span className="sr-only">Tape Menu</span>
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-72 bg-white dark:bg-black">
              <TapeMenu />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="hidden space-x-7 md:flex">
          <Link
            href="/"
            className={clsx(
              isActivePath('/')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Home
          </Link>
          <Link
            href="/bytes"
            className={clsx(
              isActivePath('/bytes')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Bytes
          </Link>
          <Link
            href="/feed"
            className={clsx(
              isActivePath('/feed')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Feed
          </Link>
          <Link
            href="/bangers"
            className={clsx(
              isActivePath('/bangers')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Bangers
          </Link>
        </div>
        <div className="flex w-1/5 items-center justify-end space-x-3">
          <GlobalSearch />
          {activeProfile?.id ? (
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
                <IconButton radius="full" highContrast variant="soft">
                  <BellOutline className="h-3.5 w-3.5" />
                </IconButton>
                {lastOpenedNotificationId !== latestNotificationId ? (
                  <span className="absolute right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
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
