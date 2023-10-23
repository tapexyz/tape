import InterestsOutline from '@components/Common/Icons/InterestsOutline'
import KeyOutline from '@components/Common/Icons/KeyOutline'
import LockOutline from '@components/Common/Icons/LockOutline'
import ProfileBanOutline from '@components/Common/Icons/ProfileBanOutline'
import ProfileManagerOutline from '@components/Common/Icons/ProfileManagerOutline'
import SubscribeOutline from '@components/Common/Icons/SubscribeOutline'
import UserOutline from '@components/Common/Icons/UserOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import {
  SETTINGS,
  SETTINGS_ALLOWANCE,
  SETTINGS_BLOCKED,
  SETTINGS_DANGER_ZONE,
  SETTINGS_INTERESTS,
  SETTINGS_MANAGER,
  SETTINGS_SESSIONS,
  SETTINGS_SUBSCRIPTION
} from '.'

const SideNav = () => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="m-1 flex flex-col space-y-1">
      <Link
        href={SETTINGS}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          { 'bg-gray-100 dark:bg-black': isActivePath(SETTINGS) }
        )}
      >
        <UserOutline className="h-4 w-4" />
        <span>
          <Trans>Basic Info</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_SUBSCRIPTION}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_SUBSCRIPTION)
          }
        )}
      >
        <SubscribeOutline className="h-4 w-4" />
        <span>
          <Trans>Subscription</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_INTERESTS}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_INTERESTS)
          }
        )}
      >
        <InterestsOutline className="h-4 w-4" />
        <span>
          <Trans>Interests</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_MANAGER}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_MANAGER)
          }
        )}
      >
        <ProfileManagerOutline className="h-4 w-4" />
        <span>
          <Trans>Manager</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_ALLOWANCE}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_ALLOWANCE)
          }
        )}
      >
        <LockOutline className="h-4 w-4" />
        <span>
          <Trans>Allowance</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_BLOCKED}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_BLOCKED)
          }
        )}
      >
        <ProfileBanOutline className="h-4 w-4" />
        <span>
          <Trans>Blocked</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_SESSIONS}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 hover:bg-gray-100 hover:dark:bg-black',
          {
            'bg-gray-100 dark:bg-black': isActivePath(SETTINGS_SESSIONS)
          }
        )}
      >
        <KeyOutline className="h-4 w-4" />
        <span>
          <Trans>Sessions</Trans>
        </span>
      </Link>
      <Link
        href={SETTINGS_DANGER_ZONE}
        className={clsx(
          'rounded-small flex items-center space-x-3 p-3 text-red-500 hover:bg-red-100 hover:dark:bg-red-900/60',
          {
            'bg-red-100 dark:bg-red-900/60': isActivePath(SETTINGS_DANGER_ZONE)
          }
        )}
      >
        <WarningOutline className="h-4 w-4" />
        <span>
          <Trans>Danger Zone</Trans>
        </span>
      </Link>
    </div>
  )
}

export default SideNav
