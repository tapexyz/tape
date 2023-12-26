import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import { Button, DropdownMenu, IconButton } from '@radix-ui/themes'
import { FEATURE_FLAGS, STATIC_ASSETS } from '@tape.xyz/constants'
import { getIsFeatureEnabled } from '@tape.xyz/generic'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import BellOutline from './Icons/BellOutline'
import ChevronDownOutline from './Icons/ChevronDownOutline'
import UploadOutline from './Icons/UploadOutline'
import GlobalSearch from './Search/GlobalSearch'
import TapeMenu from './TapeMenu'
import UserMenu from './UserMenu'

const Navbar = () => {
  const { asPath, pathname } = useRouter()
  const { resolvedTheme } = useTheme()

  const isActivePath = (path: string) => pathname === path
  const { activeProfile } = useProfileStore()
  const {
    lastOpenedNotificationId,
    latestNotificationId,
    setLastOpenedNotificationId
  } = usePersistStore()

  return (
    <div className="ultrawide:px-8 laptop:px-6 sticky top-0 z-10 flex h-14 w-full items-center bg-white/80 px-4 backdrop-blur-2xl dark:bg-black/80">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2 md:w-1/5">
          <Link className="inline-flex" href="/">
            {resolvedTheme === 'dark' ? (
              <img
                alt="tape"
                className="-mb-0.5 h-6"
                draggable={false}
                height={30}
                src={`${STATIC_ASSETS}/brand/logo-with-text-light.webp`}
                width={110}
              />
            ) : (
              <img
                alt="tape"
                className="-mb-0.5 h-6"
                draggable={false}
                height={30}
                src={`${STATIC_ASSETS}/brand/logo-with-text-dark.webp`}
                width={110}
              />
            )}
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                className="opacity-50 hover:opacity-100"
                radius="full"
                variant="ghost"
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
            className={clsx(
              isActivePath('/')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
            href="/"
          >
            Home
          </Link>
          <Link
            className={clsx(
              isActivePath('/bytes')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
            href="/bytes"
          >
            Bytes
          </Link>
          <Link
            className={clsx(
              isActivePath('/feed')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
            href="/feed"
          >
            Feed
          </Link>
          {/* <Link
            href="/explore"
            className={clsx(
              isActivePath('/explore')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Explore
          </Link> */}
          {getIsFeatureEnabled(FEATURE_FLAGS.BANGERS, activeProfile?.id) && (
            <Link
              className={clsx(
                isActivePath('/bangers')
                  ? 'font-bold'
                  : 'text-dust font-medium hover:opacity-90'
              )}
              href="/bangers"
            >
              Bangers
            </Link>
          )}
        </div>
        <div className="flex w-1/5 items-center justify-end space-x-3">
          <GlobalSearch />
          {activeProfile?.id ? (
            <>
              <Link
                className="relative hidden md:block"
                href="/notifications"
                onClick={() => {
                  if (latestNotificationId) {
                    setLastOpenedNotificationId(latestNotificationId)
                  }
                }}
              >
                <IconButton highContrast radius="full" variant="soft">
                  <BellOutline className="size-3.5" />
                </IconButton>
                {lastOpenedNotificationId !== latestNotificationId ? (
                  <span className="absolute right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </Link>
              <Link className="hidden md:block" href="/create">
                <Button highContrast>
                  <UploadOutline className="size-3.5" />
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
