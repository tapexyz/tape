import useProfileStore from '@lib/store/idb/profile'
import { tw } from '@tape.xyz/browser'
import { getIsProfileOwner } from '@tape.xyz/generic'
import {
  InterestsOutline,
  KeyOutline,
  LockOutline,
  MentionOutline,
  ProfileBanOutline,
  ProfileManagerOutline,
  SubscribeOutline,
  UserOutline,
  WarningOutline
} from '@tape.xyz/ui'
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

  const isProfileOwner = getIsProfileOwner(activeProfile, address)

  return (
    <div className="flex flex-col space-y-1 pb-10 md:ml-auto md:w-44">
      <Link
        href={SETTINGS}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <UserOutline className="size-4" />
        <span>Basic Info</span>
      </Link>
      <Link
        href={SETTINGS_FOLLOW}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_FOLLOW)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <SubscribeOutline className="size-4" />
        <span>Set Follow</span>
      </Link>
      <Link
        href={SETTINGS_HANDLES}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_HANDLES)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <MentionOutline className="size-4" />
        <span>Handles</span>
      </Link>
      <Link
        href={SETTINGS_INTERESTS}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_INTERESTS)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <InterestsOutline className="size-4" />
        <span>Interests</span>
      </Link>
      {isProfileOwner && (
        <Link
          href={SETTINGS_MANAGER}
          className={tw(
            'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
            isActivePath(SETTINGS_MANAGER)
              ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
              : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
          )}
        >
          <ProfileManagerOutline className="size-4" />
          <span>Manager</span>
        </Link>
      )}
      <Link
        href={SETTINGS_ALLOWANCE}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_ALLOWANCE)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <LockOutline className="size-4" />
        <span>Allowance</span>
      </Link>
      <Link
        href={SETTINGS_BLOCKED}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_BLOCKED)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <ProfileBanOutline className="size-4" />
        <span>Blocked</span>
      </Link>
      <Link
        href={SETTINGS_SESSIONS}
        className={tw(
          'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
          isActivePath(SETTINGS_SESSIONS)
            ? 'bg-gray-200 font-bold dark:bg-gray-800/80'
            : 'text-dust font-medium hover:bg-gray-200 dark:hover:bg-gray-900/50'
        )}
      >
        <KeyOutline className="size-4" />
        <span>Sessions</span>
      </Link>
      {isProfileOwner && (
        <Link
          href={SETTINGS_DANGER_ZONE}
          className={tw(
            'flex items-center space-x-3 rounded-lg px-3 py-1.5 text-sm text-red-500 transition-colors',
            isActivePath(SETTINGS_DANGER_ZONE)
              ? 'bg-red-200 font-bold dark:bg-red-900/50'
              : 'font-medium hover:bg-red-100 dark:hover:bg-red-900/50'
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
