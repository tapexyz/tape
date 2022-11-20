import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { BsShieldLock } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { RiVipDiamondLine } from 'react-icons/ri'

import ChannelPicture from './ChannelPicture'

type Props = {
  channel: any
}

export const SETTINGS_MEMBERSHIP = '/settings/membership'
export const SETTINGS_PERMISSIONS = '/settings/permissions'
export const SETTINGS_DANGER_ZONE = '/settings/danger'
export const SETTINGS = '/settings'

const SideNav: FC<Props> = ({ channel }) => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="p-2 bg-white rounded-xl dark:bg-theme">
      <div className="flex flex-col items-center py-4 space-y-2">
        <ChannelPicture channel={channel} />
      </div>
      <div className="flex flex-col m-1 space-y-1 text-sm">
        <Link
          href={SETTINGS}
          className={clsx(
            'flex items-center p-3 space-x-1.5 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            { 'bg-gray-100 dark:bg-gray-900': isActivePath(SETTINGS) }
          )}
        >
          <AiOutlineUser /> <span>Basic Info</span>
        </Link>
        <Link
          href={SETTINGS_MEMBERSHIP}
          className={clsx(
            'flex items-center p-3 space-x-1.5 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            {
              'bg-gray-100 dark:bg-gray-900': isActivePath(SETTINGS_MEMBERSHIP)
            }
          )}
        >
          <RiVipDiamondLine /> <span>Membership</span>
        </Link>
        <Link
          href={SETTINGS_PERMISSIONS}
          className={clsx(
            'flex items-center p-3 space-x-1.5 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            {
              'bg-gray-100 dark:bg-gray-900': isActivePath(SETTINGS_PERMISSIONS)
            }
          )}
        >
          <BsShieldLock /> <span>Permissions</span>
        </Link>
        <Link
          href={SETTINGS_DANGER_ZONE}
          className={clsx(
            'flex items-center p-3 space-x-1.5 rounded-xl hover:bg-red-100 text-red-500 hover:dark:bg-red-900/60',
            {
              'bg-red-100 dark:bg-red-900/60':
                isActivePath(SETTINGS_DANGER_ZONE)
            }
          )}
        >
          <IoWarningOutline /> <span>Danger Zone</span>
        </Link>
      </div>
    </div>
  )
}

export default SideNav
