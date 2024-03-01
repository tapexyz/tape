import { tw } from '@dragverse/browser'
import { FEATURE_FLAGS } from '@dragverse/constants'
import { getIsFeatureEnabled } from '@dragverse/generic'
import {
  BellOutline,
  Button,
  ChevronDownOutline,
  DropdownMenu
} from '@dragverse/ui'
import useProfileStore from '@lib/store/idb/profile'
import usePersistStore from '@lib/store/persist'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Logo from './Logo'
import GlobalSearch from './Search/GlobalSearch'
import TapeMenu from './TapeMenu'
import UserMenu from './UserMenu'

const Navbar = () => {
  const { pathname, asPath } = useRouter()

  const isActivePath = (path: string) => pathname === path
  const { activeProfile } = useProfileStore()
  const {
    latestNotificationId,
    setLastOpenedNotificationId,
    lastOpenedNotificationId
  } = usePersistStore()

  return (
    <div className="ultrawide:px-8 laptop:px-6 dark:bg-brand-850/80 fixed top-0 z-10 flex h-14 w-full items-center bg-white/80 px-4 backdrop-blur-2xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2 md:w-1/5">
          <Logo />
          <DropdownMenu
            align="start"
            trigger={<ChevronDownOutline className="h-3 w-3" />}
          >
            <TapeMenu />
          </DropdownMenu>
        </div>
        <div className="hidden space-x-7 md:flex">
          <Link
            href="/"
            className={tw(
              isActivePath('/')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Home
          </Link>
          <Link
            href="/bytes"
            className={tw(
              isActivePath('/bytes')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Bytes
          </Link>
          <Link
            href="/feed"
            className={tw(
              isActivePath('/feed')
                ? 'font-bold'
                : 'text-dust font-medium hover:opacity-90'
            )}
          >
            Feed
          </Link>
          {getIsFeatureEnabled(FEATURE_FLAGS.BANGERS, activeProfile?.id) && (
            <Link
              href="/bangers"
              className={tw(
                isActivePath('/bangers')
                  ? 'font-bold'
                  : 'text-dust font-medium hover:opacity-90'
              )}
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
                onClick={() => {
                  if (latestNotificationId) {
                    setLastOpenedNotificationId(latestNotificationId)
                  }
                }}
                href="/notifications"
                className="relative hidden md:block"
              >
                <div className="rounded-full bg-gray-100 p-2.5 dark:bg-gray-900">
                  <BellOutline className="size-3.5" />
                </div>
                {lastOpenedNotificationId !== latestNotificationId ? (
                  <span className="absolute right-0.5 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </Link>
              <Link href="/create" className="hidden md:block">
                <Button>Create</Button>
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link href={`/login?next=${asPath}`}>
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
