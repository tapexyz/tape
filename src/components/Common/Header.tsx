import { HOME } from '@utils/url-path'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import Login from './Login'

const GlobalSearchBar = dynamic(() => import('./Search/GlobalSearchBar'))
const NewVideoTrigger = dynamic(
  () => import('../../components/Channel/NewVideoTrigger')
)
const NotificationTrigger = dynamic(
  () => import('../../components/Notifications/NotificationTrigger')
)
const CreateChannel = dynamic(() => import('./CreateChannel'))

const Header = () => {
  return (
    <div
      className={clsx(
        'fixed z-10 flex md:left-[94px] right-2 left-2 md:right-4 items-center bg-white dark:bg-black h-14 md:h-16'
      )}
    >
      <CreateChannel />
      <div className="flex justify-between flex-1 md:w-3/4 md:justify-end">
        <div className="flex items-center space-x-1.5 md:space-x-0">
          <Link href={HOME}>
            <a className="block md:hidden">
              <img
                src="/lenstube.svg"
                draggable={false}
                className="w-5 h-5"
                alt=""
              />
            </a>
          </Link>
          <span />
        </div>
        <div className="hidden md:block">
          <GlobalSearchBar />
        </div>
      </div>
      <div className="flex flex-row items-center justify-end space-x-3 md:w-2/5">
        <NotificationTrigger />
        <NewVideoTrigger />
        <Login />
      </div>
    </div>
  )
}

export default Header
