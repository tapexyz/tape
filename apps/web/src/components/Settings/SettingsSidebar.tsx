import InterestsOutline from '@components/Common/Icons/InterestsOutline'
import KeyOutline from '@components/Common/Icons/KeyOutline'
import LockOutline from '@components/Common/Icons/LockOutline'
import MentionOutline from '@components/Common/Icons/MentionOutline'
import ProfileBanOutline from '@components/Common/Icons/ProfileBanOutline'
import ProfileManagerOutline from '@components/Common/Icons/ProfileManagerOutline'
import SubscribeOutline from '@components/Common/Icons/SubscribeOutline'
import UserOutline from '@components/Common/Icons/UserOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import useProfileStore from '@lib/store/idb/profile'
import { getIsProfileOwner } from '@tape.xyz/generic'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAccount } from 'wagmi'

import {
  SETTINGS,
  SETTINGS_ALLOWANCE,
  SETTINGS_BLOCKED,
  SETTINGS_DANGER_ZONE,
  SETTINGS_FOLLOW,
  SETTINGS_HANDLES,
  SETTINGS_INTERESTS,
  SETTINGS_MANAGER,
  SETTINGS_SESSIONS
} from '.'

const SettingsSidebar = () => {
  const router = useRouter()
  const { address } = useAccount()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const isActivePath = (path: string) => router.pathname === path

  if (!activeProfile || !address) {
    return null
  }

  return (
    <div className="m-1 flex flex-col space-y-1">
      <Link
        href={SETTINGS}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS) ? 'font-bold' : 'text-dust font-medium'
        )}
      >
        <UserOutline className="size-4" />
        <span>Basic Info</span>
      </Link>
      <Link
        href={SETTINGS_FOLLOW}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_FOLLOW) ? 'font-bold' : 'text-dust font-medium'
        )}
      >
        <SubscribeOutline className="size-4" />
        <span>Set Follow</span>
      </Link>
      <Link
        href={SETTINGS_HANDLES}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_HANDLES) ? 'font-bold' : 'text-dust font-medium'
        )}
      >
        <MentionOutline className="size-4" />
        <span>Handles</span>
      </Link>
      <Link
        href={SETTINGS_INTERESTS}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_INTERESTS)
            ? 'font-bold'
            : 'text-dust font-medium'
        )}
      >
        <InterestsOutline className="size-4" />
        <span>Interests</span>
      </Link>
      {getIsProfileOwner(activeProfile, address) && (
        <Link
          href={SETTINGS_MANAGER}
          className={clsx(
            'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
            isActivePath(SETTINGS_MANAGER)
              ? 'font-bold'
              : 'text-dust font-medium'
          )}
        >
          <ProfileManagerOutline className="size-4" />
          <span>Manager</span>
        </Link>
      )}
      <Link
        href={SETTINGS_ALLOWANCE}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_ALLOWANCE)
            ? 'font-bold'
            : 'text-dust font-medium'
        )}
      >
        <LockOutline className="size-4" />
        <span>Allowance</span>
      </Link>
      <Link
        href={SETTINGS_BLOCKED}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_BLOCKED) ? 'font-bold' : 'text-dust font-medium'
        )}
      >
        <ProfileBanOutline className="size-4" />
        <span>Blocked</span>
      </Link>
      <Link
        href={SETTINGS_SESSIONS}
        className={clsx(
          'hover:dark:bg-smoke hover:bg-gallery flex items-center space-x-3 rounded-lg px-3 py-2',
          isActivePath(SETTINGS_SESSIONS)
            ? 'font-bold'
            : 'text-dust font-medium'
        )}
      >
        <KeyOutline className="size-4" />
        <span>Sessions</span>
      </Link>
      {getIsProfileOwner(activeProfile, address) && (
        <Link
          href={SETTINGS_DANGER_ZONE}
          className={clsx(
            'hover:dark:bg-smoke text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center space-x-3 rounded-lg px-3 py-2',
            isActivePath(SETTINGS_DANGER_ZONE)
              ? 'font-bold'
              : 'text-dust font-medium'
          )}
        >
          <WarningOutline className="size-4" />
          <span>Danger Zone</span>
        </Link>
      )}
    </div>
  )
}

export default SettingsSidebar
