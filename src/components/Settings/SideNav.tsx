import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import {
  SETTINGS,
  SETTINGS_MEMBERSHIP,
  SETTINGS_PERMISSIONS
} from '@utils/url-path'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { BsShieldLock } from 'react-icons/bs'
import { RiVipDiamondLine } from 'react-icons/ri'

type Props = {
  channel: any
}

const SideNav: FC<Props> = ({ channel }) => {
  const router = useRouter()

  const isActivePath = (path: string) => router.pathname === path
  return (
    <div className="p-2 bg-white rounded-md dark:bg-black">
      <div className="flex flex-col items-center py-4 space-y-2">
        <div className="flex items-end space-x-2">
          <div className="flex-none">
            <img
              src={imageCdn(getProfilePicture(channel))}
              className="w-16 h-16 border-2 rounded-full"
              draggable={false}
              alt=""
            />
          </div>
        </div>
        <div className="text-sm">{channel.handle}</div>
      </div>
      <div className="flex flex-col m-1 space-y-1 text-sm">
        <Link href={SETTINGS}>
          <a
            className={clsx(
              'flex items-center p-2 space-x-1.5 rounded hover:bg-gray-100 hover:dark:bg-gray-900',
              { 'bg-gray-100 dark:bg-gray-900': isActivePath(SETTINGS) }
            )}
          >
            <AiOutlineUser /> <span>Basic Info</span>
          </a>
        </Link>
        <Link href={SETTINGS_MEMBERSHIP}>
          <a
            className={clsx(
              'flex items-center p-2 space-x-1.5 rounded hover:bg-gray-100 hover:dark:bg-gray-900',
              {
                'bg-gray-100 dark:bg-gray-900':
                  isActivePath(SETTINGS_MEMBERSHIP)
              }
            )}
          >
            <RiVipDiamondLine /> <span>Membership</span>
          </a>
        </Link>
        <Link href={SETTINGS_PERMISSIONS}>
          <a
            className={clsx(
              'flex items-center p-2 space-x-1.5 rounded hover:bg-gray-100 hover:dark:bg-gray-900',
              {
                'bg-gray-100 dark:bg-gray-900':
                  isActivePath(SETTINGS_PERMISSIONS)
              }
            )}
          >
            <BsShieldLock /> <span>Permissions</span>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SideNav
